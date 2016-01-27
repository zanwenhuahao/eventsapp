/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

 function createCORSRequest(method, url) {
  var xhr = new XMLHttpRequest();
  if ("withCredentials" in xhr) {

    // Check if the XMLHttpRequest object has a "withCredentials" property.
    // "withCredentials" only exists on XMLHTTPRequest2 objects.
    xhr.open(method, url, true);

  } else if (typeof XDomainRequest != "undefined") {

    // Otherwise, check if XDomainRequest.
    // XDomainRequest only exists in IE, and is IE's way of making CORS requests.
    xhr = new XDomainRequest();
    xhr.open(method, url);

  } else {

    // Otherwise, CORS is not supported by the browser.
    xhr = null;

  }
  return xhr;
}


var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    },
    submitLogin: function(){
        console.log("login attempt");
        var username=document.getElementById("username").value;
        var password=document.getElementById("password").value;
        //var url="https://api.stormpath.com/v1/applications/2XMI4I2m8QIHW4kT54ehq1/loginAttempts";
        var url="http://eventsapp.randomfiles.info/event.asp?action=authenticate";
        //var params="type=basic&value=" + btoa(username + ":" + password);
        var params="username=" + username + "&password=" + password;
        console.log("params: " + params);
        var req = createCORSRequest("POST",url,true);

        if (!req) {
            alert('CORS not supported');
            return;
        }

        //Send the proper header information along with the request
        req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        req.setRequestHeader("Content-length", params.length);
        req.setRequestHeader("Connection", "close");
        

        req.onload = function(){
            console.log("Status: " + req.status + " - readyState: " + req.readyState);
            if(req.readyState == 4 && (req.status == 200 || req.status==0)) {
                console.log("resp: " + req.responseText);
            
                var userResponse=JSON.parse(req.responseText);
                //console.log("user " + userResponse);
                if (userResponse!=null){
                    //window.localstorage.setItem("user_id",userResponse[0].user_id);
                    //window.localstorage.setItem("username",userResponse[0].username);
                    //window.localstorage.setItem("password",userResponse[0].password);
                    window.location="landing-events.html";
                }else{
                    document.getElementById("loginmessage").innerHTML="Invalid username or password!";
                }
            }
        };
        req.send(params);
        
    },
    openEvents:function(){
        var url="http://eventsapp.randomfiles.info/event.asp?action=list";
        var req = createCORSRequest("GET",url);

        if (!req) {
            alert('CORS not supported');
            return;
        }

        //Send the proper header information along with the request
        //req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        //req.setRequestHeader("Content-length", params.length);
        //req.setRequestHeader("Connection", "close");
        

        req.onload = function(){
            console.log("Status: " + req.status + " - readyState: " + req.readyState);
            if(req.readyState == 4 && (req.status == 200 || req.status==0)) {
                document.getElementById("login").style.display="none";
                document.getElementById("mainscreen").style.display="block";
                console.log("resp: " + req.responseText);
                var eventsResponse=JSON.parse(req.responseText);
                for(var i = 0; i < eventsResponse.length; i++) {
                    document.getElementById("mainscreen").innerHTML += 
                    "Event: " +  eventsResponse[i].event_name + " Time: " + eventsResponse[i].start_time + "<br/>";
                }

            }
        };
        req.send();
    }
};
