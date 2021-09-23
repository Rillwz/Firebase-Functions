const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

// auth trigger ( new user signup )
exports.newUserSignup = functions.auth.user().onCreate((user) => {
  console.log("user created", user.email, user.uid);
  return admin.firestore().collection("users").doc(user.uid).set({
    email: user.email,
    upvotedOn: [],
  });
  // for background triggers you must return a valur/promise
});

// auth trigger ( new user signup )
exports.userDeleted = functions.auth.user().onDelete((user) => {
  console.log("user deleted", user.email, user.uid);
  // for background triggers you must return a value/promise
  const doc = admin.firestore().collection("users").doc(user.uid);
  return doc.delete();
});

// HTTP callable function ( adding a request )
exports.addRequest = functions.https.onCall((data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "only authenticated users can add requests"
    );
  }
  if (data.text.lenght > 30) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "request must be no more than 30 characters long"
    );
  }
  return admin.firestore().collection("request").add({
    text: data.text,
    upvotes: 0,
  });
});

// upvote callable functions
exports.upvote = functions.https.onCall((data, context) => {
  // check auth
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "only authenticated users can add requests"
    );
  }

  //get refs for user docs & request doc
  const user = admin.firestore().collection("users").doc(context.auth.uid);
  const request = admin.firestore().collection("request").doc(data.id);

  return user.get().then((doc) => {
    // check user hasn't already upvoted the reuqest
    if (doc.data().upvoteOn.includes(data.id)) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "You can only upvote something once"
      );
    }

    // update user array
    return user
      .update({
        upvotedOn: [...doc.data().upvoteOn, data.id],
      })
      .then(() => {
        // update votes on the request
        return request.update({
          upvotes: admin.firestore.FieldValue.increment(1),
        });
      });
  });
});
