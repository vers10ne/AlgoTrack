/**
 * Copyright 2018 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

(function () {

    //Retrieve the token, server and port values for your installation in the algod.net
    //and algod.token files within the data directory
    //const atoken = "f1dee49e36a82face92fdb21cd3d340a1b369925cd12f3ee7371378f1665b9b1";
    //const aserver = "http://127.0.0.1";
    //const aport = 8080;

    const atoken = "ef920e2e7e002953f4b29a8af720efe8e4ecc75ff102b165e0472834b25832c1";
    const aserver = "http://hackathon.algodev.network";
    const aport = 9100;

    //Retrieve the token, server and port values for your installation in the kmd.net
    //and kmd.token files within the kmd directory
    // const kmdtoken = "9e0530a40582305c49881675590bc482e79dae3562ad51690a8a9139c0a25d2f";
    // const kmdserver = "http://127.0.0.1";
    // const kmdport = 7833;

    var from = document.getElementById('from');
    var to = document.getElementById('to');
    to.value = "7ZUECA7HFLZTXENRV24SHLU4AVPUTMTTDUFUBNBD64C73F3UHRTHAIOF6Q"
    var algos = document.getElementById('algos');
    algos.value = 739;

    var tb = document.getElementById('block');
    var ta = document.getElementById('ta');
    var ga = document.getElementById('account');
    var st = document.getElementById('transaction');
    var bu = document.getElementById('backup');
    var re = document.getElementById('recover');
    var wr = document.getElementById('wrecover');
    var wall = document.getElementById('wallet');
    var fround = document.getElementById('fround');
    var lround = document.getElementById('lround');
    var adetails = document.getElementById('adetails');
    var trans = document.getElementById('trans');
    var transI = document.getElementById('transI');

    var label01 = document.getElementById('label01');
    var prog01 = document.getElementById('prog01');
    var b1id = document.getElementById('b1id');
    var label02 = document.getElementById('label02');
    var prog02 = document.getElementById('2');
    var b2id = document.getElementById('b2id');
    var label03 = document.getElementById('label03');
    var prog03 = document.getElementById('prog03');
    var b3id = document.getElementById('b3id');

    var origDateTime = document.getElementById('origDateTimeId');
    var origPlace = document.getElementById('origPlaceId');
    var expectedArrivalDate = document.getElementById('oxpectedArrivalDateId');
    var sendresponse = document.getElementById('sendresponseId');
    var refTransaction = document.getElementById('refTransactionId');
    var detailsField = document.getElementById('detailsFieldId');
    var inputDest = document.getElementById('inputDestID');
    var geolocation = document.getElementById('geolocationId');
    var sensor_data = document.getElementById('sensor_dataId');
    var scanned_data = document.getElementById('scanned_dataId');
    var expected_arrival = document.getElementById('expected_arrivalId');
    var temperature = document.getElementById('temperatureId');
    var quanity = document.getElementById('quanityId');

    var txnMessge = document.getElementById('message');

    var signKey = null;
    var account = null;

    var currentdate = new Date();
    console.log("current date: ", currentdate);


    // New Algo Transaction Note Template
    // kept short for max1Kbyte limit, many points on a trip could reach this maybe
    var note_template = {
        "timestamp": currentdate, 
        "origin": origPlace,
        "origDateTime": origDateTime, 
        "expectedArrivalDate": expectedArrivalDate,
        "refTransaction": refTransaction,
        "detailsField": detailsField,
        "inputDest": inputDest,
        "geolocation": geolocation,
        "sensor_data": sensor_data,
        "scanned_data": scanned_data,
        "expected_arrival": expected_arrival,
        "temperature": temperature,
        "quanity": quanity,
    };

    function createWalletName() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < 10; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }

    //acount information
    if (adetails) {
        adetails.onclick = function () {
            ta.innerHTML = "";
            const algodclient = new algosdk.Algod(atoken, aserver, aport);

            (async () => {
                let tx = (await algodclient.accountInformation(account));
                var textedJson = JSON.stringify(tx, undefined, 4);
                console.log(textedJson);
                ta.innerHTML = textedJson;
            })().catch(e => {
                console.log(e);
            });
            (async () => {
                console.log("entered async: ")
                let txToDb = firebase.firestore().collection('accounts').add({
                    // name: getUserName(), // omitted for anonymity
                    text: textedJson,
                    profilePicUrl: getProfilePicUrl(),
                    timestamp: firebase.firestore.FieldValue.serverTimestamp()
                }).catch(function (error) {
                    console.error('Error writing new message to Firebase Database', error);
                });
            });
        }
    }
    //block status
    if (tb) {
        tb.onclick = function () {
            ta.innerHTML = "";
            const algodclient = new algosdk.Algod(atoken, aserver, aport);

            (async () => {
                let lastround = (await algodclient.status()).lastRound;
                let block = (await algodclient.block(lastround));
                fround.value = lastround;
                lround.value = lastround + 1000;
                var textedJson = JSON.stringify(block, undefined, 4);
                // console.log(textedJson);
                ta.innerHTML = textedJson;
                console.log("Got block"); // console.log(block);
                firebase.firestore().collection('accounts').add({ // test 1000 recodrs can get done
                    name: getUserName(), // omit for anonymity
                    text: textedJson,
                    profilePicUrl: getProfilePicUrl(),
                    timestamp: firebase.firestore.FieldValue.serverTimestamp()
                });
            })().catch(e => {
                console.log(e);
            });
            // (async () => {
            //     console.log("entered block status to async to FB: ")
            //     // let txToDb = firebase.firestore().collection('accounts').add({
            //     firebase.firestore().collection('accounts').add({
            //         // name: getUserName(), // omitted for anonymity
            //         text: "textedJson",
            //         profilePicUrl: getProfilePicUrl(),
            //         timestamp: firebase.firestore.FieldValue.serverTimestamp()
            //     }).catch(function (error) {
            //         console.error('Error writing new message to Firebase Database', error);
            //     });
            // });
        }
    }
    //Create account
    if (ga) {
        ga.onclick = function () {
            ta.innerHTML = "";

            var acct = algosdk.generateAccount();
            account = acct.addr;
            console.log(account);
            from.value = account;
            var mnemonic = algosdk.secretKeyToMnemonic(acct.sk);
            bu.value = mnemonic;
            console.log(mnemonic);
            var recovered_account = algosdk.mnemonicToSecretKey(mnemonic);
            console.log(recovered_account.addr);
            var isValid = algosdk.isValidAddress(recovered_account.addr);
            console.log("Is this a valid address: " + isValid);
            ta.innerHTML = "Account created. Save Mnemonic"
            signKey = acct.sk;

            // save the creaetd account
            (async () => {
                let txToDb = firebase.firestore().collection('createdaccounts').add({
                    name: getUserName(), // here User's name could be left in
                    text: textedJson,
                    profilePicUrl: getProfilePicUrl(),
                    timestamp: firebase.firestore.FieldValue.serverTimestamp()
                }).catch(function (error) {
                    console.error('Error writing new message to Firebase Database', error);
                });
            });
        }
    }
    //recover account
    if (re) {
        re.onclick = function () {
            ta.innerHTML = "";

            var recovered_account = algosdk.mnemonicToSecretKey(bu.value);
            console.log(recovered_account.addr);
            from.value = recovered_account.addr;
            var isValid = algosdk.isValidAddress(recovered_account.addr);
            console.log("Is this a valid address: " + isValid);
            ta.innerHTML = "Account created. Set value in the From Input box"
            account = recovered_account.addr;
            signKey = recovered_account.sk;
            let algodclient = new algosdk.Algod(atoken, aserver, aport);
            (async () => {
                let tx = (await algodclient.accountInformation(recovered_account.addr));
                var textedJson = JSON.stringify(tx, undefined, 4);
                console.log(textedJson);
                ta.innerHTML = textedJson;
            })().catch(e => {
                ta.innerHTML = e.text;
                console.log(e);
            });


        }
    }
    //submit transaction
    if (st) {
        st.onclick = function () {
            ta.innerHTML = "";
            //var enc = new TextEncoder(); // always utf-8
            let trackPoint = {
                "seq": 1,
                "materialId": "123xyz",
                "origin": "Factory Shop",
                "temp": 21,
                "location": "Shangai",
                "date": "10/12/2020",
                "eta": "25/12/2020"
            };
            // var note = algosdk.encodeObj(trackPoint);

            //var note = algosdk.encodeObj("This is a string converted to a Uint8Array");
            //"note": new Uint8Array(0)
            // "note": note

            var txn = {
                "from": account,
                "to": to.value.toString(),
                "fee": 1000,
                "amount": parseInt(algos.value),
                "firstRound": parseInt(fround.value),
                "lastRound": parseInt(lround.value),
                // "note": algosdk.encodeObj(note_template), // binary
                "note": algosdk.encodeObj(trackPoint), // binary
                "genesisID": "testnet-v1.0",
                "genesisHash": "SGO1GKSzyE7IEPItTxCByw9x8FmnrCDexi9/cOUJOiI="
            };

            var signedTxn = algosdk.signTransaction(txn, signKey);
            console.log(signedTxn.txID);
            let algodclient = new algosdk.Algod(atoken, aserver, aport);
            (async () => {
                let tx = (await algodclient.sendRawTransaction(signedTxn.blob)); // send to algochain
                var textedJson = JSON.stringify(tx, undefined, 4);
                console.log(textedJson);
                ta.innerHTML = textedJson;
                messge.innerHTML = textedJson;
                // console.log(tx); // obj
                console.log(tx.txId);
                txid.value = tx.txId;
            })().catch(e => {
                ta.innerHTML = e.text;
                console.log(e);
            });
        }
    }
    //Get transaction note
    if (trans) {
        trans.onclick = function () {

            ta.innerHTML = "";

            let algodclient = new algosdk.Algod(atoken, aserver, aport);
            (async () => {
                //alert( txid.value );
                let tx = (await algodclient.transactionInformation(account, txid.value));
                // let tx = (await algodclient.transactionInformation(account, "OOCOAHLEOIXFNG76RRM77W6VU4ONXHSMG4DP3ELFM36XEVVCCINA"));
                //alert(tx.noteb64);
                //alert( "got tx");
                var textedJson = JSON.stringify(tx, undefined, 4);
                console.log(textedJson);
                //alert("Note " + tx.noteb64);
                var encodednote = algosdk.decodeObj(tx.note);
                //alert(encodednote);
                ta.innerHTML = JSON.stringify(encodednote, undefined, 4);

            })().catch(e => {
                ta.innerHTML = e.text;
                if (e.text === undefined) {
                    // ta.innerHTML = "Tx not processed yet or is to old and not stored on your node";
                }
                console.log(e);
            });
        }
    }
    //Get any transaction if isIndexerActive and Archival are set to true on the node
    //See node configuration settings on developer.algorand.org
    if (transI) {
        transI.onclick = function () {

            ta.innerHTML = "";

            let algodclient = new algosdk.Algod(atoken, aserver, aport);
            (async () => {
                //alert( txid.value );
                let tx = (await algodclient.transactionById(txid.value));
                //alert(tx.noteb64);
                //alert( "got tx");
                var textedJson = JSON.stringify(tx, undefined, 4);
                ta.innerHTML = textedJson;
                //var encodednote = algosdk.decodeObj(tx.note);
                //ta.innerHTML = JSON.stringify(encodednote, undefined, 4);

            })().catch(e => {
                ta.innerHTML = e.text;
                console.log(e);
            });
        }
    }
})();


/**
 * Firebase start
 */

// Sign-in
function signIn() {
  // Sign into Firebase using popup auth & Google as the identity provider.
  var provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider);
}

// Sign-out
function signOut() {
  // Sign out of Firebase.
  firebase.auth().signOut();
}

// Initiate Firebase Auth.
function initFirebaseAuth() {
  // Listen to auth state changes.
  firebase.auth().onAuthStateChanged(authStateObserver);
}

/**
 * Keep this human and usable, Users will want to see who they're dealing with
 * even in an anonymised world, with avatars etc. 
 * But it makes the app and UX better.
 */
// Returns the signed-in user's profile pic URL.
function getProfilePicUrl() {
  return firebase.auth().currentUser.photoURL || '/images/profile_placeholder.png';
}
/**
 * Could display usernames, or not. Could even be made a User choice.
 */
// Returns the signed-in user's display name.
function getUserName() {
  return firebase.auth().currentUser.displayName;
}

// Returns true if a user is signed-in.
function isUserSignedIn() {
  return !!firebase.auth().currentUser;
}

// Saves a new message on the Cloud Firestore.
function saveMessage(messageText) {
    // console.log("entered async: ")
    firebase.firestore().collection('Transactions').add({
        name: getUserName(), // could be omitted for anonymity
        text: note_template,
        profilePicUrl: getProfilePicUrl(), // could be omitted. see UX note below
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    }).catch(function (error) {
        console.error('Error writing new message to Firebase Database', error);
    });
    // Add a new message entry to the Firebase database.
    return firebase.firestore().collection('messages').add({
        name: getUserName(),
        text: messageText,
        profilePicUrl: getProfilePicUrl(),
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    }).catch(function (error) {
        console.error('Error writing new message to Firebase Database', error);
    });
}

// Loads messages history and listens for upcoming ones.
function loadMessages() {
    // Create the query to load the last 12 messages and listen for new ones.
    var query = firebase.firestore()
        .collection('messages')
        .orderBy('timestamp', 'desc')
        .limit(12);

    // Start listening to the query.
    query.onSnapshot(function (snapshot) {
        snapshot.docChanges().forEach(function (change) {
            if (change.type === 'removed') {
                deleteMessage(change.doc.id);
            } else {
                var message = change.doc.data();
                displayMessage(change.doc.id, message.timestamp, message.name,
                    message.text, message.profilePicUrl, message.imageUrl);
            }
        });
    });
}

/**
 * These stubs for images are here for possible future features
 * Where e.g. Users take a photo of the merchandise being transported at each stage
 * of the journey. That way the buyer or other stakeholders (insurers) could visually 
 * track their cargo/product/etc being moved.
 */
// // Saves a new message containing an image in Firebase.
// // This first saves the image in Firebase storage.
// function saveImageMessage(file) {
//   // TODO 9: Posts a new image as a message.
// }

/**
 * There could also be features such as geolocation tagging
 * and other sensor information
 */

// Saves the messaging device token to the datastore.
function saveMessagingDeviceToken() {
    firebase.messaging().getToken().then(function (currentToken) {
        if (currentToken) {
            console.log('Got FCM device token:', currentToken);
            // Saving the Device Token to the datastore.
            firebase.firestore().collection('fcmTokens').doc(currentToken)
                .set({ uid: firebase.auth().currentUser.uid });
        } else {
            // Need to request permissions to show notifications.
            requestNotificationsPermissions();
        }
    }).catch(function (error) {
        console.error('Unable to get messaging token.', error);
    });
}

// Requests permission to show notifications.
function requestNotificationsPermissions() {
    console.log('Requesting notifications permission...');
    firebase.messaging().requestPermission().then(function () {
        // Notification permission granted.
        saveMessagingDeviceToken();
    }).catch(function (error) {
        console.error('Unable to get permission to notify.', error);
    });
}

// Triggered when a file is selected via the media picker.
function onMediaFileSelected(event) {
  event.preventDefault();
  var file = event.target.files[0];

  // Clear the selection in the file picker input.
  imageFormElement.reset();

  // Check if the file is an image.
  if (!file.type.match('image.*')) {
    var data = {
      transaction: 'You can only share images',
      timeout: 2000
    };
    signInSnackbarElement.MaterialSnackbar.showSnackbar(data);
    return;
  }
  // Check if the user is signed-in
  if (checkSignedInWithMessage()) {
    saveImageMessage(file);
  }
}

// Triggered when the send new message form is submitted.
function onMessageFormSubmit(e) {
  e.preventDefault();
  // Check that the user entered a message and is signed in.
  if (messageInputElement.value && checkSignedInWithMessage()) {
    saveMessage(messageInputElement.value).then(function() {
      // Clear message text field and re-enable the SEND button.
      resetMaterialTextfield(messageInputElement);
      toggleButton();
    });
  }
}

// Triggers when the auth state change for instance when the user signs-in or signs-out.
function authStateObserver(user) {
  if (user) { // User is signed in!
    // Get the signed-in user's profile pic and name.
    var profilePicUrl = getProfilePicUrl();
    var userName = getUserName();

    // Set the user's profile pic and name.
    userPicElement.style.backgroundImage = 'url(' + addSizeToGoogleProfilePic(profilePicUrl) + ')';
    userNameElement.textContent = userName;

    // Show user's profile and sign-out button.
    userNameElement.removeAttribute('hidden');
    userPicElement.removeAttribute('hidden');
    signOutButtonElement.removeAttribute('hidden');

    // Hide sign-in button.
    signInButtonElement.setAttribute('hidden', 'true');

    // We save the Firebase Messaging Device token and enable notifications.
    saveMessagingDeviceToken();
  } else { // User is signed out!
    // Hide user's profile and sign-out button.
    userNameElement.setAttribute('hidden', 'true');
    userPicElement.setAttribute('hidden', 'true');
    signOutButtonElement.setAttribute('hidden', 'true');

    // Show sign-in button.
    signInButtonElement.removeAttribute('hidden');
  }
}

// Returns true if user is signed-in. Otherwise false and displays a message.
function checkSignedInWithMessage() {
  // Return true if the user is signed in Firebase
  if (isUserSignedIn()) {
    return true;
  }

  // Display a message to the user using a Toast.
  var data = {
    message: 'You must sign-in first',
    timeout: 2000
  };
  signInSnackbarElement.MaterialSnackbar.showSnackbar(data);
  return false;
}

// Resets the given MaterialTextField.
function resetMaterialTextfield(element) {
  element.value = '';
  element.parentNode.MaterialTextfield.boundUpdateClassesHandler();
}

// Template for messages.
var MESSAGE_TEMPLATE =
    '<div class="message-container">' +
      '<div class="spacing"><div class="pic"></div></div>' +
      '<div class="message"></div>' +
      '<div class="name"></div>' +
    '</div>';

// Adds a size to Google Profile pics URLs.
function addSizeToGoogleProfilePic(url) {
  if (url.indexOf('googleusercontent.com') !== -1 && url.indexOf('?') === -1) {
    return url + '?sz=150';
  }
  return url;
}

// A loading image URL.
var LOADING_IMAGE_URL = 'https://www.google.com/images/spin-32.gif?a';

// Delete a Message from the UI.
function deleteMessage(id) {
  var div = document.getElementById(id);
  // If an element for that message exists we delete it.
  if (div) {
    div.parentNode.removeChild(div);
  }
}

function createAndInsertMessage(id, timestamp) {
  const container = document.createElement('div');
  container.innerHTML = MESSAGE_TEMPLATE;
  const div = container.firstChild;
  div.setAttribute('id', id);

  // If timestamp is null, assume we've gotten a brand new message.
  // https://stackoverflow.com/a/47781432/4816918
  timestamp = timestamp ? timestamp.toMillis() : Date.now();
  div.setAttribute('timestamp', timestamp);

  // figure out where to insert new message
  const existingMessages = messageListElement.children;
  if (existingMessages.length === 0) {
    messageListElement.appendChild(div);
  } else {
    let messageListNode = existingMessages[0];

    while (messageListNode) {
      const messageListNodeTime = messageListNode.getAttribute('timestamp');

      if (!messageListNodeTime) {
        throw new Error(
          `Child ${messageListNode.id} has no 'timestamp' attribute`
        );
      }

      if (messageListNodeTime > timestamp) {
        break;
      }

      messageListNode = messageListNode.nextSibling;
    }

    messageListElement.insertBefore(div, messageListNode);
  }

  return div;
}

// Displays a Message in the UI.
function displayMessage(id, timestamp, name, text, picUrl, imageUrl) {
  var div = document.getElementById(id) || createAndInsertMessage(id, timestamp);

  // profile picture
  if (picUrl) {
    div.querySelector('.pic').style.backgroundImage = 'url(' + addSizeToGoogleProfilePic(picUrl) + ')';
  }

  div.querySelector('.name').textContent = name;
  var messageElement = div.querySelector('.message');

  if (text) { // If the message is text.
    messageElement.textContent = text;
    // Replace all line breaks by <br>.
    messageElement.innerHTML = messageElement.innerHTML.replace(/\n/g, '<br>');
  } else if (imageUrl) { // If the message is an image.
    var image = document.createElement('img');
    image.addEventListener('load', function() {
      messageListElement.scrollTop = messageListElement.scrollHeight;
    });
    image.src = imageUrl + '&' + new Date().getTime();
    messageElement.innerHTML = '';
    messageElement.appendChild(image);
  }
  // Show the card fading-in and scroll to view the new message.
  setTimeout(function() {div.classList.add('visible')}, 1);
  messageListElement.scrollTop = messageListElement.scrollHeight;
  messageInputElement.focus();
}

// Enables or disables the submit button depending on the values of the input
// fields.
function toggleButton() {
  if (messageInputElement.value) {
    submitButtonElement.removeAttribute('disabled');
  } else {
    submitButtonElement.setAttribute('disabled', 'true');
  }
}

// Checks that the Firebase SDK has been correctly setup and configured.
function checkSetup() {
  if (!window.firebase || !(firebase.app instanceof Function) || !firebase.app().options) {
    window.alert('You have not configured and imported the Firebase SDK. ' +
        'Make sure you go through the codelab setup instructions and make ' +
        'sure you are running the codelab using `firebase serve`');
  }
}

// Checks that Firebase has been imported.
checkSetup();

// Shortcuts to DOM Elements.
var messageListElement = document.getElementById('messages');
var messageFormElement = document.getElementById('message-form');
var messageInputElement = document.getElementById('message');
var submitButtonElement = document.getElementById('submit');
var imageButtonElement = document.getElementById('submitImage');
var imageFormElement = document.getElementById('image-form');
var mediaCaptureElement = document.getElementById('mediaCapture');
var userPicElement = document.getElementById('user-pic');
var userNameElement = document.getElementById('user-name');
var signInButtonElement = document.getElementById('sign-in');
var signOutButtonElement = document.getElementById('sign-out');
var signInSnackbarElement = document.getElementById('must-signin-snackbar');

// Saves message on form submit.
messageFormElement.addEventListener('submit', onMessageFormSubmit);
signOutButtonElement.addEventListener('click', signOut);
signInButtonElement.addEventListener('click', signIn);

// Toggle for the button.
messageInputElement.addEventListener('keyup', toggleButton);
messageInputElement.addEventListener('change', toggleButton);

// // Events for image upload.
// imageButtonElement.addEventListener('click', function(e) {
//   e.preventDefault();
//   mediaCaptureElement.click();
// });
// mediaCaptureElement.addEventListener('change', onMediaFileSelected);

// initialize Firebase
initFirebaseAuth();

// Remove the warning about timstamps change. 
var firestore = firebase.firestore();
var settings = {timestampsInSnapshots: true};
firestore.settings(settings);

// Initialize Firebase Performance Monitoring.
firebase.performance();

// We load currently existing messages and listen to new ones.
loadMessages();
