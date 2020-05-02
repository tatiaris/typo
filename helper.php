<?php

$func = $_POST["func"];

if ($func == "get_passage") {
    echo get_passage();
}

function get_passage() {
    // $conn = new mysqli("localhost", "tatiakqf_admin", "Gottobe$&@me", "tatiakqf_tatiame");
    $conn = new mysqli("localhost", "root", "", "tatiame");
    $i = rand(1, 7978);
    $sql = "SELECT * FROM `passages` WHERE id = $i";
    $passage = $conn->query($sql)->fetch_assoc()["passage"];
    $conn->close();
    return $passage;
}

?>
