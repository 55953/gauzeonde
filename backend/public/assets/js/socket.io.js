<script>
    
    socket.emit('driver_location', {
    driver_id: 12,
    latitude: ...,
    longitude: ...,
    shipment_tracking: 'ABC123',
    timestamp: Date.now()
    });

    socket.emit('join_shipment', 'ABC123');
    socket.on('location_update', data => {
    // Show live driver position on map!
    });
    function(){
    //D. PHP Backend: Also Save Location to DB
    // Your PHP endpoint still stores the location for history/analytics.
    }
    
    On the Node.js side, broadcast to the shipment room:
    io.to(postData.shipment_tracking).emit('transfer_update', postData);

</script>