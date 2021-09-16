var app = new Vue({
  el: "#app",
  data: {
    requests: [],
  },
  mounted() {
    const ref = firebase.firestore().collection("request");

    ref.onSnapshot((snapshoot) => {
      let request = [];
      snapshoot.forEach((doc) => {
        request.push({ ...doc.data(), id: doc.id });
      });
      this.requests = request;
    });
  },
});
