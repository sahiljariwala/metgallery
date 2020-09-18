var itemsID = [];
var savedGallery = [];

fetch('https://collectionapi.metmuseum.org/public/collection/v1/search?hasImages=true&q=Architecture')
	.then(
	function(response) {
	  if (response.status !== 200) {
	    console.log('Looks like there was a problem. Status Code: ' +
	      response.status);
	    return;
	  }

	  // Examine the text in the response
	  response.json().then(function(data) {
	    if(data.objectIDs.length){
	    	for(var i= 0; i < data.objectIDs.length; i++){
	    		if(itemsID.length < 25){
	    			itemsID.push(data.objectIDs[i]);
	    		} else {
	    			break;
	    		}
	    	}
	    }
	    console.log(itemsID);
	    getItemData(itemsID);
	  });
	}
	)
	.catch(function(err) {
	console.log('Fetch Error :-S', err);
});

function getItemData(itemsID) {
	var items = [];
	if(itemsID.length){
		itemsID.forEach(function(item){
			fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${item}`)
				.then(
				function(response) {
				  if (response.status !== 200) {
				    console.log('Looks like there was a problem. Status Code: ' +
				      response.status);
				    return;
				  }

				  // Examine the text in the response
				  response.json().then(function(data) {
				    if(data.primaryImage !== ""){
				    	items.push(data);
				    	document.getElementById("museumGallery").innerHTML += `<div class="col"><div class="card object-${data.objectID}"><img src="${data.primaryImage}" alt="${data.title}" class="img-responsive"/><h2>${data.title}</h2><p>${data.artistDisplayName}</p><a href="${data.objectURL}" class="btn-link" target="_blank">More Details</a> <button onclick="addItem(${data.objectID})" class="btn-link">Save</button></div></div>`;
				    }
				    console.log(items);
				  });
				}
				)
				.catch(function(err) {
					console.log('Fetch Error :-S', err);
				});
		})
	}
}

function addItem(objectID){
	document.getElementsByClassName(`object-${objectID}`)[0].classList.add("selected");
	if(savedGallery.length < 5){
		fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectID}`)
			.then(
			function(response) {
			  if (response.status !== 200) {
			    console.log('Looks like there was a problem. Status Code: ' +
			      response.status);
			    return;
			  }

			  // Examine the text in the response
			  response.json().then(function(data) {
			    savedGallery.push(data);
			    if(savedGallery.length === 5){
			    	showPersonalGallery();
			    }
			  });
			}
			)
			.catch(function(err) {
				console.log('Fetch Error :-S', err);
			});
	} else {
		alert("You add select maximum of 5 items");
	}
}

function renderSavedGallery(){
	document.getElementById("savedGallery").innerHTML = "";
	document.getElementById("savedGallery").innerHTML +="<h1>Personal Met Gallery<h1><h3>Saved 5 items are:</h3>";
	savedGallery.forEach(function(data){
		document.getElementById("savedGallery").innerHTML += `<div class="col"><div class="card object-${data.objectID}"><img src="${data.primaryImage}" alt="${data.title}" class="img-responsive"/><h2>${data.title}</h2><p>${data.artistDisplayName}</p><a href="${data.objectURL}" class="btn-link" target="_blank">More Details</a></div></div>`;
	})
}

function showPersonalGallery(){
	document.getElementById("museumGallery").style.display = "none";
	document.getElementById("savedGallery").style.display = "block";
	renderSavedGallery();
}