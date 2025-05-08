const {
	jsPDF
} = require('jspdf');

function createPDF() {
	var pdf = new jsPDF('portrait');

	console.log('page h: ' + pdf.internal.pageSize.height + ', w: ' + pdf.internal.pageSize.width);

	// title
	pdf.setFontSize(40);
	pdf.setFont(undefined, 'bold');
	pdf.text(10, 20, "Hello World");

	// footer centered
	pdf.setFontSize(14);
	pdf.setFont(undefined, 'italic');
	const footerText = "Made with Titanium";
	const textWidth = pdf.getStringUnitWidth(footerText) * pdf.internal.getFontSize() / pdf.internal.scaleFactor;
	var textOffset = (pdf.internal.pageSize.width - textWidth) / 2;
	pdf.text(textOffset, pdf.internal.pageSize.height - 10, footerText);

	// add image
	var image = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory, "appicon.png");
	pdf.addImage(getImageData(image), 'JPEG', pdf.internal.pageSize.width * 0.5 - 20, 50, 40, 40);

	function getImageData(image) {
		return 'data:image/jpg;base64,' + Ti.Utils.base64encode(image).text;
	}

	// save to file
	var file = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, 'test.pdf');
	pdf.save(file.nativePath);

	if (OS_ANDROID) {
		// Android - share PDF
		var intent = Ti.Android.createIntent({
			action: Ti.Android.ACTION_SEND,
			type: "application/pdf",
		});
		intent.putExtraUri(Ti.Android.EXTRA_STREAM, file.nativePath);
		var open = Ti.Android.createIntentChooser(intent, "open pdf");
		Ti.Android.currentActivity.startActivity(open);
	} else {
		// iOS
		var docViewer = Ti.UI.iOS.createDocumentViewer({
			url: file.nativePath
		});

		setTimeout(function() {
			docViewer.show({
				animated: false
			});
		}, 1000);
	}
}

$.index.open();
