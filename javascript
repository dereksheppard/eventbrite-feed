<script src="//cdnjs.cloudflare.com/ajax/libs/moment.js/2.10.3/moment.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/list.js/1.2.0/list.min.js"></script>
<script>
  $(document).ready(function() {
    var $filter = $("#filter");
    var $searchButton = $("#searchButton");
    var $searchAgain = $("#searchAgain");
    var $monthSelect = $("#MonthName");
    var $noResults = $("#noResults");
    var token = 'XXXXXXXXXXXXXXXXX';
    var $eventsDiv = $("#events");
    //Loop through the pages using the pagination.page_count
    var page1 = 'https://www.eventbriteapi.com/v3/users/XXXXXXXX/owned_events/?status=live&order_by=start_asc&token=' + token + '&expand=venue';
    var page2 = 'https://www.eventbriteapi.com/v3/users/XXXXXXXX/owned_events/?status=live&order_by=start_asc&token=' + token + '&expand=venue&page=2';

    $eventsDiv.html("<i class=\"fa fa-spinner fa-spin fa-3x fa-fw\"></i><p>Loading events, please stand by...</p>");

    //creates array based on paginated Eventbrite feed data. Starts with page1 and adds &=page2, etc, then pushes each additional array into allData variable
    var allData = [];

    $.getJSON(page1, function(data) {
      var pages = data.pagination.page_count;
      var eventObjs = [];
      getEventData(pages);
    });

    function getEventData(pages) {
      $.getJSON(page1 + '&page=' + pages, function(data) {
        $.each(data.events, function(i, event) {
          //pushes additional pages into array
          allData.push(event);
          //sorts array based on date
          allData.sort(function(a, b) {
            return new Date(a.start.local).getTime() - new Date(b.start.local).getTime();
          });
        });
        pages--;
        if (pages > 0) {
          getEventData(pages);

        } else {
          //console.log(allData);
          //creates template to display array data
          if (allData.length) {
            var s = "";
            for (var i = 0; i < allData.length; ++i) {
              var event = allData[i];
              var eventTime = moment(event.start.local).format('ddd., MMMM Do');
              var eventDateClass = moment(event.start.local).format('MMMM');
              var eventDescription = event.description.text.replace(/\s+/g, ' ').trim().substring(0, 450).split(" ").slice(0, -1).join(" ") + " ...";

              s += "<div class=\"eventContainer col-sm-12 call-out-text call-out-text-default p-b-0 " + eventDateClass + "\"><div class=\"\"><div class=\"col-sm-8\">";
              s += "<h3 class=\"m-t-0\">" + event.name.text + "</h3>";
              s += "<p>" + eventDescription + " <a target=\"_blank\" href='" + event.url + "'>Read the full description</a></p></div>";
              s += "<div class=\"col-sm-4\"><div class=\"portal-list\">";
              s += "<span class=\"lead\">" + eventTime + "</span><br><a target=\"_blank\" class=\"btn btn-block btn-primary\" href='" + event.url + "'><span class=\"fa fa-check-circle\"></span> Read more</a>";
              s += "<ul><li>" + event.venue.address.city + "</li>";
              s += "<li>" + event.venue.name + "</li>";
              s += "<li><a target=\"_blank\" href='https://www.google.com/maps/dir//" + event.venue.latitude + "," + event.venue.longitude + "'>Get directions <span class=\"fa fa-compass\"></span></a></li></ul>";
              s += "</div></div></div></div>";
            }
            //displays template
            $eventsDiv.html(s);

          } else {
            $eventsDiv.html("<p>Sorry, there are no upcoming events.</p>");

          }

        }

      });

    }

    $searchButton.click(function() {
      $searchButton.prop('disabled', true);
      // Retrieve the input field text and reset the count to zero
      var filter = $filter.val();

      $(".eventContainer:visible").each(function() {

        // If the list item does not contain the text phrase fade it out
        if ($(this).text().search(new RegExp(filter, "i")) < 0) {
          $(this).hide();

          // Show the list item if the phrase matches and increase the count by 1
        } else {
          $(this).show();
          //count++;
          $searchAgain.html("<div class=\"alert alert-success\"><p>See your search results below! Click \"Reset\" to perform a new search.</p></div>");
        }
        if ($('.eventContainer:visible').length === 0) {
          $noResults.html("<div class=\"alert alert-danger\"><p><span class=\"fa fa-exclamation-circle\"></span>  Hmm... We didn't find any courses matching your search. Click \"Reset\" to perform a new search.</p></div>");
        } else $noResults.html("");

      });

    });

    $monthSelect.change(function() {
      var MonthName = $monthSelect.val();
      var MonthNameSelector = '';

      if (MonthName == "all") {
        //show all items
        $(".eventContainer").show();
      } else {
        if (MonthName != "all") {
          MonthNameSelector = '.' + MonthName;
        }

        $(".eventContainer").hide();
        $(MonthNameSelector).show();
      }
      if ($('.eventContainer:visible').length === 0) {
        $noResults.html("<div class=\"well\"><p>No events are scheduled this month. Select another month, or select all.</p></div>");
      } else $noResults.html("");
    });

    $("#reset").click(function() {
      $(".eventContainer").show();
      $monthSelect.prop('disabled', false);
      $searchButton.prop('disabled', false);
      $noResults.html("");
      $searchAgain.html("");
    });
    $filter.blur(function() {
      if ($(this).val().length != 0) {
        $monthSelect.prop('disabled', true);
      }
    });
    $filter.keypress(function(e) {
      var key = e.which;
      if (key == 13) // the enter key code
      {
        $searchButton.click();
        return false;
      }
    });

  }); 
</script>
