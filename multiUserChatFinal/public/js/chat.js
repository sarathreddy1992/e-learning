var socket = io();

function scrollToBottom() {
    // Selectors
    var messages = jQuery('#messages');
    var newMessage = messages.children('li')
    // Heights
    var clientHeight = messages.prop('clientHeight');
    var scrollTop = messages.prop('clientTop');
    var scrollHeight = messages.prop('clientHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight();

    if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight){
        messages.scrollTop(scrollHeight);
    }
}

function notifyMe(messages) {
  // Let's check if the browser supports notifications
  if (!("Notification" in window)) {
    alert("This browser does not support desktop notification");
  }

  // Let's check whether notification permissions have already been granted
  else if (Notification.permission === "granted") {
    // If it's okay let's create a notification
    var notification = new Notification(messages);
  }

  // Otherwise, we need to ask the user for permission
  else if (Notification.permission !== "denied") {
    Notification.requestPermission(function (permission) {
      // If the user accepts, let's create a notification
      if (permission === "granted") {
        var notification = new Notification(messages);
      }
    });
  }

  // At last, if the user has denied notifications, and you 
  // want to be respectful there is no need to bother them any more.
}

socket.on('connect', () => {
    console.log('Connected to Server');
    var params = jQuery.deparam(window.location.search);

    socket.emit('join', params, (err) => {
        if(err) {
            alert(err);
            window.location.href = '/';
        } else {
            console.log(('No Error'));
        }
    });
});

socket.on('disconnect', () => {
    console.log('Disconnected from Server');
});

socket.on('updateUserList', (users) => {
    console.log('Users List', users);
    var ol = jQuery('<ol></ol>');

    users.forEach((user) => {
        ol.append(jQuery('<li></li>').text(user));
    });

    jQuery('#users').html(ol);
});

socket.on('newMessage', (message) => {
    var formattedTime = moment(message.createdAt).format('h:mm a');
    var template = jQuery('#message-template').html();
    var html = Mustache.render(template, {
        text: message.text,
        from: message.from,
        createdAt: formattedTime
    });

    jQuery('#messages').append(html);
    scrollToBottom();
    notifyMe(`${message.from} | ${formattedTime} : ${message.text}`);
    // var li = jQuery('<li></li>');
    // li.text(`${message.from} | ${formattedTime}: ${message.text}`);

    // jQuery('#messages').append(li);
});

socket.on('newLocationMessage', (message) => {
    var formattedTime = moment(message.createdAt).format('h:mm a');
    var template = jQuery("#location-message-template").html();
    var html = Mustache.render(template, {
        from: message.from,
        createdAt: formattedTime,
        url: message.url
    });

    // var li = jQuery("<li></li>");
    // var a = jQuery("<a target='_blank'>My current location</a>");

    // li.text(`${message.from} | ${formattedTime}: `);
    // a.attr('href', message.url);
    // li.append(a);
     
    jQuery('#messages').append(html);
    scrollToBottom();
    notifyMe(`${message.from} | ${formattedTime} : Current Location`);
})

jQuery('#message-form').on('submit', (e) => {
    e.preventDefault();

    var messageTextbox = jQuery('[name=message]');

    socket.emit('createMessage', {
        text: messageTextbox.val()
    }, () => {
        messageTextbox.val('');
    })
});

var locationButton = jQuery('#send_location');
locationButton.on('click', (e) => {
    if(!navigator.geolocation) {
        return alert('Geolocation not supported by your browser.');
    }

    locationButton.attr('disabled', 'disabled').text('Sending location...');

    navigator.geolocation.getCurrentPosition((position) => {
        locationButton.removeAttr('disabled').text('Sending Location');
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        })
    }, () => {
        locationButton.removeAttr('disabled').text('Sending Location');
        alert('Unable to fetch location');
    })
})