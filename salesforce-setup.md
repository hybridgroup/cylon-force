# Salesforce Setup
## Getting Started
1. First you'll need an account on DeveloperForce. If you don't already have one, you can create one at: http://developer.force.com/join

2. Next, you need to configure a new connected app in your developer profile in order to retrieve all the keys, tokens, urls nedded to connect your app with SalesForce. In order to do this:
  * Go to -> Setup (top) > Create (side) > Apps > Connected Apps (scroll down ) > New Check "Enable Oauth Settings".
  * Next, add all permissions. Use "http://localhost:3000/oauth/_callback" as your callback URL. You'll be using the Oauth2 web server flow, so you need your personal security code. If you don't have one, go to your Profile and click reset security token and Salesforce should email it to you.
  * Setup > My Personal Information > Reset My Security Code, you'll need your password + security token to be able to login (PASSWORDsecurityCode (concatenated, no space)).

3. Now we need to setup an object with a couple of custom fields for streaming communication. In this example we'll create a new object and call it 'Sphero_Message':
  We also add two custom fields to this object: 'Sphero_Name' and 'Bucks'.
  * Go to Setup -> Create -> Object -> New and name it Sphero_Message
  * Create custom attributes "Sphero_Name" and "Bucks" both text type.
  * We've created a Salesforce package that installs the Sphero_Message Object and the apexRest class for you to speed things up. Install it [here](https://login.salesforce.com/packaging/installPackage.apexp?p0=04ti00000004IoN)

4. Setup apexRest code so we can create new objects using RESTfull implementation:
  * Go click in My Profile -> Developer Console, when the developer console opens up go to:
  * Click File -> New -> Apex Class and the following code to that:
  * We've created a Salesforce package that installs the Sphero_Message Object and the apexRest class for you to speed things up. Install it [here](https://login.salesforce.com/packaging/installPackage.apexp?p0=04ti00000004IoN)

  ```
  @RestResource(urlMapping='/SpheroController/*')
  global with sharing class SpheroController {
    @HttpPost
      global static void create(String spheroName, String bucks) {
        SpheroController.handleSpheroMessage(spheroName, bucks)
      }

    public static void handleSpheroMessage(String spheroName, String bucks) {
      Sphero_Message__c sm = new Sphero_Message__c();
      sm.Sphero_Name__c = spheroName;
      sm.Bucks__c = bucks;
      insert sm;
    }
  }
  ```

5. To be able to stream we need to setup a PushTopic to connect to.
  * Go to developer console click on Debug -> Open Execute Anonymus Code or (Ctrl +E)
  * Add code to create the new pushTopic with the query you want to execute and the events you want it to report.

  ```
  PushTopic pt = new PushTopic();
  pt.apiversion = 28.0;
  pt.name = 'SpheroMsgOutbound'; pt.description = 'All new Sphero Message records';
  pt.query = 'SELECT Id, Name, Sphero_Name__c, Bucks__c FROM Sphero_Message__c';
  insert pt;
  System.debug('Created new PushTopic: '+ pt.Id);
  ```

6. At this point everything in salesforce should be ready and we should be able to connect, authenticate, push/create records through apexRest and stream information using the pushTopic. 
