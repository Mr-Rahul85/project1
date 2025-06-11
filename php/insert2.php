<?php 
$host = "localhost";
$dbUsername = "root";   
$dbPassword = "Rahul@2005ggu";       
$dbname = "userdata";   

$conn = new mysqli($host, $dbUsername, $dbPassword, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error); 
}

$fName = $_POST['fName'];
$lName = $_POST['lName'];
$email = $_POST['email'];
$password = $_POST['password'];

if (!empty($fName) && !empty($lName) && !empty($email) && !empty($password)) {
    
    
    $SELECT = "SELECT email FROM userinfo WHERE email = ? LIMIT 1";
    $stmt = $conn->prepare($SELECT);
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $stmt->bind_result($existingEmail);
    $stmt->store_result();
    $rnum = $stmt->num_rows;

    if ($rnum == 0) {
        // Hash the password before inserting it (for security)
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    
        $INSERT = "INSERT INTO userinfo (fName, lName, email, password) VALUES (?, ?, ?, ?)";
        $stmt = $conn->prepare($INSERT);
        $stmt->bind_param("ssss", $fName, $lName, $email, $hashedPassword);
        $stmt->execute();
        echo "<script>alert('New record inserted successfully!');</script>";
    } else {
        echo "<script>alert('This email is already registered!');</script>";
    }


    $stmt->close();
} else {
    echo "All fields are required!";
}

$conn->close();
?>
