var app = new Vue({
  el: "#app",
  data: {
    requests: [],
  },
  methods: {
    upvoteRequest(id) {
      console.log(id);
      const upvote = firebase.functions().httpsCallable("upvote");
      upvote({ id }).catch((error) => {
        showNotification(error.message);
      });
    },
  },
  mounted() {
    const ref = firebase.firestore().collection("requests");

    ref.onSnapshot((snapshoot) => {
      let request = [];
      snapshoot.forEach((doc) => {
        request.push({ ...doc.data(), id: doc.id });
      });
      this.requests = request;
    });
  },
});
