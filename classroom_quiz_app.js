Posts = new Meteor.Collection('posts');
ApprovedPosts = new Meteor.Collection('approved_posts');
wipe = false;


if (Meteor.isClient) {
    
    function getCurrentUser ()
  {
    return Meteor.user().emails[0].address.split('@')[0]; 
  }

    function send_student_response()
    {
      var currentUser =  getCurrentUser(); 
      var currentChatContentObject = $('#response');
      var currentChatContent = currentChatContentObject.val();
      Posts.insert({'response': currentChatContent,'username':currentUser, timestamp: (new Date()).getTime()
    })
    }
    
    Template.classroom_view.lines = function (){
        return ApprovedPosts.find({}, {sort: {timestamp:1}}).fetch();
    };
    
    Template.teacher_view.lines= function (){
        return Posts.find({},{sort:{timestamp:1}}).fetch();
    };


  Template.student_view.events({
    'click #send': function () {            
      send_student_response()
    },
    
    'keydown #response': function(keypressed)
    {
      if (keypressed.which == 13){
        event.preventDefault()
          send_student_response()
      }
    }    
  });
    Template.teacher_view.events({
        'click .approve': function(){
            ApprovedPosts.insert({'response':this.response, 'username': this.username, 'timestamp': this.timestamp})
            Posts.remove({'_id':this._id})
        },
        'click .delete': function(){
            Posts.remove({'_id':this._id})
        },
        'click #wipe': function(){
            Meteor.call('wipe');
        },
    });
}

if (Meteor.isServer) {
  Meteor.startup(function() {

    return Meteor.methods({

      wipe: function() {

        return ApprovedPosts.remove({});

      }

    });

  });

}
