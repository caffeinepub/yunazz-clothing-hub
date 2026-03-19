import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";

module {
  // Old version types for backward compatibility
  type OldProduct = {
    id : Nat;
    name : Text;
    description : Text;
    price : Float;
    category : Text;
    imageId : Text;
    createdAt : Int;
  };

  type OldUserProfile = {
    name : Text;
  };

  type OldActor = {
    products : Map.Map<Nat, OldProduct>;
    userProfiles : Map.Map<Principal, OldUserProfile>;
    nextProductId : Nat;
  };

  // New version types (matching the updated actor)
  type NewProduct = {
    id : Nat;
    name : Text;
    description : Text;
    price : Float;
    category : Text;
    imageId : Text;
    createdAt : Int;
  };

  type NewUserProfile = {
    profile : {
      name : Text;
    };
    createdAt : Int;
    updatedAt : Int;
  };

  type NewActor = {
    products : Map.Map<Nat, NewProduct>;
    userProfiles : Map.Map<Principal, NewUserProfile>;
    nextProductId : Nat;
    firstAdminClaimed : Bool;
  };

  public func run(old : OldActor) : NewActor {
    let newUserProfiles = old.userProfiles.map<Principal, OldUserProfile, NewUserProfile>(
      func(_principal, oldProfile) {
        {
          profile = oldProfile;
          createdAt = 0;
          updatedAt = 0;
        };
      }
    );

    {
      old with
      userProfiles = newUserProfiles;
      firstAdminClaimed = false;
    };
  };
};
