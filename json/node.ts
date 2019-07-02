export default (function(){
  var v0 = [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "votesRemaining",
      "args": null,
      "storageKey": null
    }
  ];
  return {
    "kind": "Fragment",
    "name": "VoteForReflectionGroupMutation_team",
    "type": "VoteForReflectionGroupPayload",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "error",
        "storageKey": null,
        "args": null,
        "concreteType": "StandardMutationError",
        "plural": false,
        "selections": [
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "message",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "title",
            "args": null,
            "storageKey": null
          }
        ]
      },
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "meeting",
        "storageKey": null,
        "args": null,
        "concreteType": "RetrospectiveMeeting",
        "plural": false,
        "selections": (v0/*: any*/)
      },
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "meetingMember",
        "storageKey": null,
        "args": null,
        "concreteType": "RetrospectiveMeetingMember",
        "plural": false,
        "selections": (v0/*: any*/)
      },
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "reflectionGroup",
        "storageKey": null,
        "args": null,
        "concreteType": "RetroReflectionGroup",
        "plural": false,
        "selections": [
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "viewerVoteCount",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "voteCount",
            "args": null,
            "storageKey": null
          }
        ]
      },
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "unlockedStages",
        "storageKey": null,
        "args": null,
        "concreteType": null,
        "plural": true,
        "selections": [
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "id",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "isNavigable",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "isNavigableByFacilitator",
            "args": null,
            "storageKey": null
          }
        ]
      }
    ]
  };
})();
