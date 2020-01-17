$('.delete-campground').on('click', function(){
  Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this action!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, delete it!'
  }).then((result) => {
    if (result.value) {
      $.ajax({
        method: "POST",
        url: "/campgrounds?_method=DELETE",
        data: {campgroundID: $('#campground-id').text()}
      })
        .done(function(){
          Swal.fire(
            'Deleted!',
            'The campground has been deleted.',
            'success'
          ).then(()=>{
            $(location).attr('href', '/campgrounds')
          })
        })

    }
  })
});