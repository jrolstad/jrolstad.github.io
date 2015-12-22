jQuery(function() {
  // Initalize lunr with the fields it will be searching on. I've given title
  // a boost of 10 to indicate matches on this field are more important.
  window.idx = lunr(function () {
    this.field('id');
    this.field('title', { boost: 10 });
    this.field('author');
    this.field('category');
    this.field('content');
  });

  // Download the data from the JSON file we generated
  window.data = $.getJSON('/api/posts.json');

  // Wait for the data to load and add it to lunr
  window.data.then(function(loaded_data){
    $.each(loaded_data, function(index, value){
      window.idx.add(
        $.extend({ "id": index }, value)
      );
    });
  });

  // Event when the form is submitted
  $("#site_search").submit(function(){
      event.preventDefault();
      var query = $("#search_box").val(); // Get the value for the text field
      var results = window.idx.search(query); // Get lunr to perform a search
      display_search_results(results); // Hand the results off to be displayed
  });
  
  function comparePostsByTitle(a,b) {
     var itemA = loaded_data[a.ref];
     var itemB = loaded_data[b.ref];
  if (itemA.title < itemB.title)
    return -1;
  if (itemA.title > itemB.title)
    return 1;
  return 0;
  }

  function display_search_results(results) {
    var $search_results = $("#search_results");

    // Wait for data to load
    window.data.then(function(loaded_data) {

      // Are there any results?
      if (results.length) {
        $search_results.empty(); // Clear any old results
        
        // Sort the results by title
        results.sort(comparePostsByTitle);
        
        // Iterate over the results
        results.forEach(function(result) {
          var item = loaded_data[result.ref];

          // Build a snippet of HTML for this result
          var appendString = '<a href="' + item.url + '" class="post-link"><h3 class="h2 post-title">' + item.title + '</h3></a>';

          // Add it to the results
          $search_results.append(appendString);
        });
      } else {
        $search_results.html('<h2 class="h2 post-title">No Matching Results Found</h3>');
      }
    });
  }
});
