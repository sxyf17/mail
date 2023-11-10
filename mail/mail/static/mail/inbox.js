document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  //submit email
  document.querySelector('#compose-form').addEventListener('submit', send_email);

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function send_email(event) {
  event.preventDefault();
  //store fields
  const recipients = document.querySelector('#compose-recipients').value;
  const subject = document.querySelector('#compose-subject').value;
  const body = document.querySelector('#compose-body').value;

  //send data
  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
        recipients: recipients,
        subject: subject,
        body: body
    })
  })
  .then(response => response.json())
  .then(result => {
      // Print result
      console.log(result);
      load_mailbox('sent');
  });
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  
  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  //show mailbox content (emails)
  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(emails => {

    //first clear out previous emails displayed
    const emailsList = document.querySelector('#emailsList');
    emailsList.innerHTML = '';
    
    //display these emails
    emails.forEach((email) => {
      const emailContent = document.createElement('div');
      emailContent.className = 'emails';
      emailContent.innerHTML = `From: ${email.sender} Subject: ${email.subject} at ${email.timestamp}`;
      document.querySelector('#emailsList').appendChild(emailContent);
      
      //give this div its own id
      emailContent.id = email.id;
      emailContent.onclick = function() {

        if (email.read === true) {
          emailContent.style.background = '#D3D3D3';
        }
        else {
          emailContent.style.background = 'white';
        }
        //mark email as read
        if (!email.read) {
          email.read = true;
          console.log(email, email.read);
        }
      } 
    });
  });
  
}



