//client.js
$(document).ready(function () {
    // Handle form submit
    $('#item-form').on('submit', function (e) {
        e.preventDefault();

        var name = $('#name').val();
        var email = $('#email').val();
        var phone = $('#phone').val();
        var itemDescription = $('#item').val();
        var status = $('#status').val();
        var roomType = $('#roomType').val();  // Capture roomType value

        // Log the form values
        console.log('name:', name);
        console.log('email:', email);
        console.log('phone:', phone);
        console.log('itemDescription:', itemDescription);
        console.log('status:', status);
        console.log('roomType:', roomType);  // Log roomType

        // Send POST request to /addItem
        $.ajax({
            type: 'POST',
            url: 'http://localhost:3000/addItem',
            data: JSON.stringify({
                item: {
                    name: name,
                    email: email,
                    phone: phone,
                    itemDescription: itemDescription,
                    status: status,
                    roomType: roomType  // Add roomType to the data
                },
                priority: new Date().getTime()
            }),
            contentType: 'application/json',
            success: function (data) {
                // Refresh items
                getItems();
            }
        });
    });

    function getItems() {
        // Send GET request to /items
        $.ajax({
            type: 'GET',
            url: 'http://localhost:3000/items',
            success: function (data) {
                var itemsContainer = $('#items-container');

                // Clear current items
                itemsContainer.empty();

                // Add new items
                data.forEach(function (element) {
                    var item = element[0];  // The item is the first element of the array
                    var itemCard = $('<div class="item-card"></div>');
                    var itemHeader = $('<h3 class="item-header"></h3>');
                    var itemDescription = $('<p></p>');
                    var roomType = $('<p></p>');  // New paragraph for room type

                    itemHeader.text((item.status === 'lost' ? 'Waiting to Transfer: ' : 'Completed: ') + item.itemDescription);
                    itemDescription.text('Reported by ' + item.name + '. Please contact at ' + item.email + ' or ' + item.phone + ' if interested.');
                    roomType.text('Room Type: ' + item.roomType);  // Show room type

                    itemCard.append(itemHeader);
                    itemCard.append(itemDescription);
                    itemCard.append(roomType);  // Add room type to card
                    itemsContainer.append(itemCard);
                });
            }
        });
    }


    // Get initial items
    getItems();
});
