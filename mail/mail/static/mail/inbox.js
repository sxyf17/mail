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
  
  document.querySelector('#compose-view').style.display = 'block';
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#emailsList').style.display = 'none';
  document.querySelector('#email-content').style.display = 'none';

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
  document.querySelector('#emailsList').style.display = 'block';
  document.querySelector('#email-content').style.display = 'none';
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

      if (email.read === true) {
        emailContent.style.background = '#D3D3D3';
      }
      else {
        emailContent.style.background = 'white';
      }
      
      //mark email as read
      emailContent.onclick = function() {

        view_email(email.id);
        if (!email.read) {

          fetch(`/emails/${email.id}`, {
            method: 'PUT',
            body: JSON.stringify({
                read: true
            })
          })
          emailContent.style.background = '#D3D3D3';
          

        }
      } 
    });
  });
  
}

function view_email(email_id){

  //get the email using the id
  fetch(`/emails/${email_id}`)
  .then(response => response.json())
  .then(email => {
      // Print email
      console.log(email);

      //show the email and hide other views
      document.querySelector('#email-content').style.display = 'block';
      document.querySelector('#emails-view').style.display = 'none';
      document.querySelector('#emailsList').style.display = 'none';
      document.querySelector('#compose-view').style.display = 'none';

      // Get or create the elements
      const header = document.getElementById('email-header') || document.createElement('div');
      const subject = document.getElementById('email-subject') || document.createElement('div');
      const body = document.getElementById('email-body') || document.createElement('div');

      //set their id
      header.id = 'email-header';
      subject.id = 'email-subject';
      body.id = 'email-body';

      header.innerHTML = '';
      subject.innerHTML = '';
      body.innerHTML = '';


      header.innerHTML = `From: ${email.sender} To: ${email.recipients} ${email.timestamp}`;
      subject.innerHTML = `Subject: ${email.subject}`;
      body.innerHTML = `${email.body}`;

      document.querySelector('#email-content').appendChild(header);
      document.querySelector('#email-content').appendChild(subject);
      document.querySelector('#email-content').appendChild(body);


  });
}



