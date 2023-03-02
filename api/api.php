<?php
require_once("config.php");

$data = file_get_contents("php://input");
$params = json_decode($data,true);
$body = "hi";
if (!empty($params['body'])) {
    $body = $params['body'];
}

$data = array(
    "model"=>"gpt-3.5-turbo",
    "messages"=>$body
);

function apiPost($url,$apiKey, array $params = array(),$timeout=30)
{
    try {
        $data_string = json_encode($params);
        $data_string = preg_replace("/\s+/",'',$data_string);

        $headers = array(
            'Content-Type: application/json',
            'Authorization: Bearer ' . $apiKey,
        );
        $ch = curl_init();//初始化
        curl_setopt($ch, CURLOPT_URL, $url);//抓取指定网页
        curl_setopt($ch, CURLOPT_HEADER, 0);//设置header
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);//要求结果为字符串且输出到屏幕上
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, $timeout);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); // 跳过证书检查
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, true);  // 从证书中检查SSL加密算法是否存在
        curl_setopt($ch, CURLOPT_POST, 1);//post提交方式
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        curl_setopt ( $ch, CURLOPT_TIMEOUT, $timeout );
        //             curl_setopt ( $ch, CURLOPT_POSTFIELDS, $params );
        curl_setopt($ch, CURLOPT_POSTFIELDS,$data_string);
        $result = curl_exec($ch);//运行curl
        curl_close($ch);
        return ($result);

    }catch (Exception $e){
        echo $e->getMessage();
    }
    return false;
}

$apiKey = getConfig()["apikey"];

$response = apiPost("https://api.openai.com/v1/chat/completions",$apiKey,$data);
echo $response;
die();





?>