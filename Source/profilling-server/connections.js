(function() {
    const ejs = require('ejs');
    function renderTotalConnectionsView(data) {
        const template = `
        <!DOCTYPE html>
            <html>
            <head>
                <title>Your Connections</title>
                <meta charset="utf-8" />
                <link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
            </head>
            <body>
                <div class="col-sm-offset-2 col-sm-10" style="margin-top:16px; display:none;" id="authorize_header">
                    Would you like to add your social contacts to your profile?
                </div>

                <!--Add buttons to initiate auth sequence and sign out-->
                <button id="authorize_button" class="col-sm-offset-2    btn btn-default" style="display: none;">Authorize</button>

                <div class="col-sm-offset-2 col-sm-10" style="margin-top:16px; display:none;" id="content_header">
                    Following information will be added to your user profile:
                </div>

                <form class="form-horizontal" method="post" action="<%= action %>" id="content" style="display:none;">
                    <input type="hidden" name="_csrf" value="<%= csrfToken %>">
                
                    <% if (fields.totalContacts) { %>
                        <label for="totalContacts" class="col-sm-2 control-label">Total Contacts</label>
                        <div class="col-sm-4">
                            <input type="text" class="form-control" id="toalContacts" name="totalContacts" placeholder="0" value="<%= fields.totalContacts.value %>" readonly>
                        </div>
                        </div>
                    <% } %>
                
                    <div class="form-group">
                    <div class="col-sm-offset-2 col-sm-10" style="margin-top:16px;" >
                        <button type="submit" class="btn btn-default">Upload</button>
                    </div>
                    </div>
                </form>

                <script type="text/javascript">
                // Client ID and API key from the Developer Console
                var CLIENT_ID = '598011401638-em45ucf0fpg02htkavsa0h99fq16u70r.apps.googleusercontent.com';
                var API_KEY = 'AIzaSyAzxl6SxlBkpvK8q4Gaxgbdk6NiYBBr8xo';

                // Array of API discovery doc URLs for APIs used by the quickstart
                var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/people/v1/rest"];

                // Authorization scopes required by the API; multiple scopes can be
                // included, separated by spaces.
                var SCOPES = "https://www.googleapis.com/auth/contacts.readonly";

                var authorizeButton = document.getElementById('authorize_button');
                var authorizeHeader = document.getElementById('authorize_header');
                var contentHeader = document.getElementById('content_header');
                var content = document.getElementById('content');

                /**
                 *  On load, called to load the auth2 library and API client library.
                 */
                function handleClientLoad() {
                    gapi.load('client:auth2', initClient);
                }

                function returnToHomeClick() {
                    window.location.href = '/';
                }

                /**
                 *  Initializes the API client library and sets up sign-in state
                 *  listeners.
                 */
                function initClient() {
                    gapi.client.init({
                    apiKey: API_KEY,
                    clientId: CLIENT_ID,
                    discoveryDocs: DISCOVERY_DOCS,
                    scope: SCOPES
                    }).then(function () {
                    // Listen for sign-in state changes.
                    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

                    // Handle the initial sign-in state.
                    updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
                    authorizeButton.onclick = handleAuthClick;

                    }, function(error) {
                    appendPre(JSON.stringify(error, null, 2));
                    });
                }

                /**
                 *  Called when the signed in status changes, to update the UI
                 *  appropriately. After a sign-in, the API is called.
                 */
                function updateSigninStatus(isSignedIn) {
                    if (isSignedIn) {
                        authorizeButton.style.display = 'none';
                        authorizeHeader.style.display = 'none';
                        contentHeader.style.display = 'block';
                        content.style.display = 'block';
                        listConnectionNames();
                    } else {
                        authorizeHeader.style.display = 'block';
                        authorizeButton.style.display = 'block';
                        contentHeader.style.display = 'none';
                        content.style.display = 'none';
                    }
                }

                /**
                 *  Sign in the user upon button click.
                 */
                function handleAuthClick(event) {
                    gapi.auth2.getAuthInstance().signIn();
                }

                /**
                 * Append a pre element to the body containing the given message
                 * as its text node. Used to display the results of the API call.
                 *
                 * @param {string} message Text to be placed in pre element.
                 */
                function appendPre(message) {
                    var pre = document.getElementById('content');
                    var textContent = document.createTextNode(message);
                    pre.appendChild(textContent);
                }

                /**
                 * Print the display name if available for 10 connections.
                 */
                function listConnectionNames() {
                    gapi.client.people.people.connections.list({
                    'resourceName': 'people/me',
                    'pageSize': 2000,
                    'personFields': 'names,emailAddresses',
                    'key' :'AIzaSyAzxl6SxlBkpvK8q4Gaxgbdk6NiYBBr8xo',
                    }).then(function(response) {
                    var connections = response.result.connections;

                    document.querySelector("#toalContacts").value = connections.length;
                    });
                }

                </script>

                <script async defer src="https://apis.google.com/js/api.js"
                onload="this.onload=function(){};handleClientLoad()"
                onreadystatechange="if (this.readyState === 'complete') this.onload()">
                </script>
            </body>
            </html>

        `;
        
        return ejs.render(template, data);
      }

    module.exports = {
        show: renderTotalConnectionsView
    }
}());