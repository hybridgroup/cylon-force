# Salesforce Setup
## Guetting Started
  1.
  First you need to create a developer org account at: http://developer.force.com/join

  2.
  We need to configure a new connected app in your developer org so we
  can get all the keys, tokens, urls nedded to connect to salesforce.

  To do so go to ->
    Setup (top) > Create (side) > Apps > Connected Apps (scroll down ) > New
  Check "Enable Oauth Settings"
  Add all permissions
  Use "http://localhost:3000/oauth/_callback" as your callback URL
  You'll be using the Oauth2 web server flow
  You need your personal security code, if yu don't have one go to
  profile and click reset security token and Salesforce should email it to
  you.
  Setup > My Personal Information > Reset My Security Code
  You'll need your password + security token to be able to login (PASSWORDsecurityCode (concatenated, no space))

  3.
    We need to setup an object with a couple of custom fields for
    streaming communication, in this example we'll create a new object and call it 'Sphero_Message'.
    We also add two custom fields to this object 'Sphero_Name' and 'Content'.
    3.1 Go to Setup -> Create -> Object -> New and name it Sphero_Message
    3.2 Create custom attributes "Sphero_Name" and "Content" both text type.
    
  4. Setup apexRest code so we can create new objects using RESTfull
     implementation.
    4.1 Go click in My Profile -> Developer Console
    When the developer console opens up go to:
    4.2 Click File -> New -> Apex Class and the following code to that:

```java
@RestResource(urlMapping='/SpheroController/*')
global with sharing class SpheroController {
	@HttpPost
        global static void create(String identifier, String msg) {
			SpheroController.handleSpheroUpsert(identifier);
        	SpheroController.handleSpheroMessage(identifier, msg);
        }

    public static void handleSpheroUpsert(String identifier) {
        Sphero__c s = new Sphero__c();
        s.Identifier__c = identifier;
        Database.upsert(s, Sphero__c.Fields.Identifier__c);
    }

    public static void handleSpheroMessage(String identifier, String msg) {
        Sphero_Message__c sm = new Sphero_Message__c();
        Sphero__c spheroReg = new Sphero__c();
        spheroReg.Identifier__c = identifier;
        sm.Sphero__r = spheroReg;
        sm.Sphero_Name__c = identifier;
        sm.Content__c = msg;
        insert sm;
    }
}

```

  5. To be able to stream we need to setup a PushTopic to connect to.
    5.1 Go to developer console click on Debug -> Open Execute Anonymus Code or (Ctrl +E)
    5.2 Add code to create the new pushTopic with the query you want to execute and the events you want it to report.
```java
PushTopic pt = new PushTopic();
pt.apiversion = 28.0;
pt.name = 'SpheroMsgOutbound'; pt.description = 'All new Sphero Message records';
pt.query = 'SELECT Id, Name, Sphero_Name__c, Content__c FROM Sphero_Message__c';
insert pt;
System.debug('Created new PushTopic: '+ pt.Id);
```

  6. At this point everything in salesforce should be ready and we
     should be able to connect, authenticate, push/create records
     through apexRest and stream information using the pushTopic.
