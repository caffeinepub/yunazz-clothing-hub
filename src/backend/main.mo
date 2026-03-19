import Nat "mo:core/Nat";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Map "mo:core/Map";
import Principal "mo:core/Principal";
import MixinStorage "blob-storage/Mixin";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import Migration "migration";

(with migration = Migration.run)
actor {
  let accessControlState = AccessControl.initState();
  let products = Map.empty<Nat, Product>();
  let userProfiles = Map.empty<Principal, InternalUserProfile>();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  public type Product = {
    id : Nat;
    name : Text;
    description : Text;
    price : Float;
    category : Text;
    imageId : Text;
    createdAt : Int;
  };

  public type UserProfile = {
    name : Text;
  };

  // Internal representation with metadata
  type InternalUserProfile = {
    profile : UserProfile;
    createdAt : Int;
    updatedAt : Int;
  };

  var nextProductId = 0;
  var firstAdminClaimed = false;

  // User Profile Functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    switch (userProfiles.get(caller)) {
      case (null) { null };
      case (?internal) { ?internal.profile };
    };
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    switch (userProfiles.get(user)) {
      case (null) { null };
      case (?internal) { ?internal.profile };
    };
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };

    let currentTime = Time.now();
    let userProfile = {
      profile;
      createdAt = currentTime;
      updatedAt = currentTime;
    };

    userProfiles.add(caller, userProfile);
  };

  // Product Query Functions (Public - No Auth Required)
  public query ({ caller }) func getProducts() : async [Product] {
    products.values().toArray();
  };

  public query ({ caller }) func getProduct(id : Nat) : async ?Product {
    products.get(id);
  };

  public query ({ caller }) func getProductsByCategory(category : Text) : async [Product] {
    products.values().toArray().filter(
      func(product) {
        product.category == category;
      }
    );
  };

  // Product Management Functions (Admin Only)
  public shared ({ caller }) func addProduct(name : Text, description : Text, price : Float, category : Text, imageId : Text) : async Product {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    let id = nextProductId;
    nextProductId += 1;
    let product = {
      id;
      name;
      description;
      price;
      category;
      imageId;
      createdAt = Time.now();
    };
    products.add(id, product);
    product;
  };

  public shared ({ caller }) func updateProduct(id : Nat, name : Text, description : Text, price : Float, category : Text, imageId : Text) : async ?Product {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    switch (products.get(id)) {
      case (null) { null };
      case (?existingProduct) {
        let updatedProduct = {
          existingProduct with
          name;
          description;
          price;
          category;
          imageId;
        };
        products.add(id, updatedProduct);
        ?updatedProduct;
      };
    };
  };

  public shared ({ caller }) func removeProduct(id : Nat) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    let existed = products.containsKey(id);
    products.remove(id);
    existed;
  };

  // Claim first admin function
  public shared ({ caller }) func claimFirstAdmin() : async () {
    // Check if first admin has already been claimed
    if (firstAdminClaimed) {
      Runtime.trap("Unauthorized: First admin has already been claimed");
    };

    // Assign admin role to caller
    AccessControl.assignRole(accessControlState, caller, caller, #admin);

    // Mark that first admin has been claimed
    firstAdminClaimed := true;
  };
};
