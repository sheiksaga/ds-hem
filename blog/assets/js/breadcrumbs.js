$(document).ready(function() {
    // Get the current page URL and split it into segments
    var url = window.location.href;
    var segments = url.split('/');
      
    // Remove the first segment (the domain) and the last segment (the page name)
    segments.shift();
    segments.pop();
      
    // Create an empty array to store the breadcrumb links
    var breadcrumbs = [];
    
// Loop through the remaining segments and create a link for each one
$.each(segments, function(index, segment) {
    var title = segment.replace(/-/g, ' ').toUpperCase(); // Convert hyphens to spaces and uppercase the text
    var link = '/' + segments.slice(0, index + 1).join('/') + '/'; // Create the link URL by joining the segments
    var crumb = '<a href="' + link + '">' + title + '</a>'; // Create the breadcrumb link
    breadcrumbs.push(crumb); // Add the breadcrumb link to the array
    });
      
    // Join the breadcrumb links with the separator (">" in this example) and insert them into the page
    var separator = '<span> > </span>';
    var breadcrumbHtml = '<div class="breadcrumbs">' + breadcrumbs.join(separator) + '</div>';
    $('body').append(breadcrumbHtml); // Insert the breadcrumb element at the beginning of the page body
    });