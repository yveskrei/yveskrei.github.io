//Variables
let speedWriting = 100;
let speedBetweenLines = 500;
let typeWriterInterval = null;
let mode = 'single'

$(window).ready(function() {
  $('#magazine').turn({
      display: mode,
	  page: 4,
	  when: {
		  turning: function(e, page) {
			  if(writerPage && writerPage != page) {
				stopWriter()
				
				clearText(writerPage)
				clearText(page)
				
				if(writerPage > page) {//Means we're going forward
					//We want to add text to the page we've already
					//been at
					addWholeText(writerPage)
				}		
			  }
		  },
		  turned: function(e, page) {
			  let txt = texts[page]
			  
			  if(txt && txt != null && txt.length > 0) {
				typeWriter(page);
			  }
		  }
	  }
    });
});


$(window).keydown(function(event) {
	if(event.keyCode == 37) {//Arrow left
		$('#magazine').turn('next')
	}
	
	if(event.keyCode == 39) {//Arrow right
		$('#magazine').turn('previous')
	}
})

//TypeWriter variables
let noteIndex = 0;
let writerPage = null
let isWriting = false

function typeWriter(page) {
	//Call anyways, to make sure
	stopWriter();
	
	if(!typeWriterInterval) {
		let txt = texts[page];
		if(txt && txt != null && txt.length > 0) {
			clearText(page)
			noteIndex = 0;
			writerPage = page;
			isWriting = true;
			
			typeWriterInterval = setInterval(function() {
				if(noteIndex < txt.length) {
					let note = txt[noteIndex];
					let element = null;
					noteIndex++;
					
					if(writerPage == "signature") {
						element = $(".magazine-page.page-1 .signature");
					} else {
						element = $(".magazine-page.page-"+page+" .text");
					}
					
					if(note == "|") {
						element.append("<br />")
						isWriting = false
					} else {
						element.append(note)
						isWriting = true
					}
				} else {
					stopWriter();
					
					if(writerPage == 3 && mode == 'double') {
						typeWriter(2)
					}
					
					if(writerPage == 1) {
						typeWriter("signature")
					}
				}
			}, isWriting ? speedWriting : speedBetweenLines);
		}
	}
}

function stopWriter() {
	console.log("stopping!");
	if(typeWriterInterval != null) {
		clearInterval(typeWriterInterval)
		typeWriterInterval = null
	}
}

function clearText(page) {
	console.log('cleared'+page)
	if(page == "signature") {
		$(".magazine-page.page-1 .signature").empty()
	} else {
		$(".magazine-page.page-"+page+" .text").empty()
	}
}

function addWholeText(page) {
	let txt = texts[page]
	for(let i = 0; i < txt.length; i++) {
		let element = null;
		let note = txt[i];
		
		if(writerPage == "signature") {
			element = $(".magazine-page.page-1 .signature");
		} else {
			element = $(".magazine-page.page-"+page+" .text");
		}
		
		if(note == "|") {
			element.append("<br />")
		} else {
			element.append(note)
		}
	}
}
