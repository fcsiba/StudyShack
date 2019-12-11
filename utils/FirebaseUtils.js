
import firebase, {analytics, initializeApp, database} from 'firebase';
// import Base64 from 'base-64';

// var firebaseConfig = {
//     apiKey: "AIzaSyCH7hwIqNVQUTCVH2fP1EQ94LguQs7V1pA",
//     authDomain: "icict-eac61.firebaseapp.com",
//     databaseURL: "https://icict-eac61.firebaseio.com",
//     projectId: "icict-eac61",
//     storageBucket: "icict-eac61.appspot.com",
//     messagingSenderId: "40053409361",
//     appId: "1:40053409361:web:0170288c3f8fbc3d"
// };
// firebase.initializeApp(firebaseConfig);

var firebaseConfig = {
    apiKey: "AIzaSyCezX2xl46o3OasMLtbUV-FYnSGzyoTjPE",
    authDomain: "study-shack-54dae.firebaseapp.com",
    databaseURL: "https://study-shack-54dae.firebaseio.com",
    projectId: "study-shack-54dae",
    storageBucket: "study-shack-54dae.appspot.com",
    messagingSenderId: "742308992276",
    appId: "1:742308992276:web:032556e53c5f5e880c5e01",
    measurementId: "G-0EX51PZC51"
  };
  // Initialize Firebase
  initializeApp(firebaseConfig);
//   analytics();

class FirebaseUtils {

    static shared = new FirebaseUtils()

    constructor() {

    }
    
    FireBase = database();

    // async uploadImage(uri) {
    //     const response = await fetch(uri);
    //     const blob = await response.blob();
    //     const ref = firebase
    //         .storage()
    //         .ref()
    //         .child(`users/images/123123/avatar`);
    //     const snapshot = await ref.put(blob);
    //     return snapshot.downloadURL;
    // }

    // uploadFiles(result) {
    //     global.atob = Base64.encode;
    //     let storage = firebase.storage()
    //     storageRef = storage.ref();
    //     var metadata = {
    //         contentType: 'image/jpeg'
    //     };
    //     const uri = result.uri;
    //     const ext = uri.substr(uri.lastIndexOf('.') + 1);
    //     const name = Math.round(+new Date() / 1000);
    //     let file = {
    //         name: name + "." + ext,
    //         type: "image/" + ext,
    //         uri
    //     }

    //     var uploadTask = storageRef.child('users/images/image1.jpg').put(file, metadata);
    //     uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
    //         function (snapshot) {
    //             var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    //             console.log('Upload is ' + progress + '% done');
    //             switch (snapshot.state) {
    //                 case firebase.storage.TaskState.PAUSED: // or 'paused'
    //                     console.log('Upload is paused');
    //                     break;
    //                 case firebase.storage.TaskState.RUNNING: // or 'running'
    //                     console.log('Upload is running');
    //                     break;
    //             }
    //         }, function (error) {
    //             switch (error.code) {
    //                 case 'storage/unauthorized':
    //                     break;
    //                 case 'storage/canceled':
    //                     break;
    //                 case 'storage/unknown':
    //                     break;
    //             }
    //         }, function () {
    //             uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
    //                 console.log('File available at', downloadURL);
    //             });
    //         });
    // }

}
let firebaseUtils = FirebaseUtils.shared;
export { firebaseUtils }

