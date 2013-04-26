<?php

    $image = $_POST['imageData'];
    
    $filteredData = substr($image, strpos($image, ",")+1);
    
    $unencodedData = base64_decode($filteredData);
    
    $filename = date("YmdHis") . '.png';
    
    $fp = fopen($filename, 'wb');
    fwrite( $fp, $unencodedData);
    fclose( $fp );

    echo $filename;
    
?>
