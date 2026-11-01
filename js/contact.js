/* ==========================================================================
   EduSphere — contact.html
   Author: Azamat Mustafin
   Bootstrap form validation (Assignment #3, Task 9). Moved out of the HTML
   into its own file in Assignment #5 (separation of HTML and JavaScript).
   Assignment #6: rewritten with jQuery; a valid form is "sent" with the
   loading button (js/engagement.js) and confirmed with a toast (js/helpers.js).
   ========================================================================== */

$(function () {
  const $form = $('#contact-form');
  const $success = $('#form-success');

  // on submit, add .was-validated so Bootstrap paints valid fields green and invalid ones red
  $form.on('submit', function (event) {
    event.preventDefault();               // demo site: nothing is really sent
    $form.addClass('was-validated');
    $success.addClass('d-none');

    if (!this.checkValidity()) {
      showToast('Please fill in the fields marked in red.', 'warning');
      return;
    }

    submitWithSpinner($form, function () {
      $form.trigger('reset');             // clears the fields (see the reset handler below)
      $success.removeClass('d-none');
      showToast('Form submitted successfully! A mentor will reply within one working day.', 'success');
      playSound('success');
    });
  });

  $form.on('reset', function () {
    $form.removeClass('was-validated');
    $success.addClass('d-none');
  });
});
