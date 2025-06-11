<?php

$host = "localhost";
$dbUsername = "root";   
$dbPassword = "Rahul@2005ggu";       
$dbname = "userdata";   


$conn = new mysqli($host, $dbUsername, $dbPassword, $dbname);


if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

session_start(); 

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
   
    $email = $_POST['email'];
    $password = $_POST['password'];

  
    if (!empty($email) && !empty($password)) {
       
        $SELECT = "SELECT email, password FROM userinfo WHERE email = ?";
         $stmt = $conn->prepare($SELECT);
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            $user = $result->fetch_assoc();
            // Verify the password
            if (password_verify($password, $user['password'])) {
                
                $_SESSION['user_id'] = $user['user_id'];
                $_SESSION['fName'] = $user['fName'];
                $_SESSION['lName'] = $user['lName'];                           
                header("Location: home.php");
                
                exit();
            } else {
                echo "<script>alert('Invalid username or password. Please try again.');</script>";
            }
        } else {
            echo "No user found with this email!";
        }
        $stmt->close();
    }
}

// Close the database connection
$conn->close();
?>
