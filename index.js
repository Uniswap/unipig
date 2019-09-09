var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest
var xhr = new XMLHttpRequest()

var data = null

xhr.withCredentials = true

xhr.addEventListener("readystatechange", function() {
  if (this.readyState === 4) {
    console.log(this.responseText)
  }
})

xhr.open(
  "PUT",
  "https://api.twitter.com/1.1/account_activity/all/dev/webhooks.json?include_entities=true?url=https://unipig-kdcl6m1h4.now.sh/api/webhook/twitter/"
)
xhr.setRequestHeader(
  "Authorization",
  'OAuth oauth_consumer_key="7wt9rXE6wabrzWws8t9NnjZgy",oauth_nonce="TgKfT3xkxVb",oauth_signature="M5Ga%2FBdTsMuQqFencPpIdv%2Fqlak%3D",oauth_signature_method="HMAC-SHA1",oauth_timestamp="1567801954",oauth_token="1169730193260519424-dIJNRO1ZQa0RAWWqkD5eIx6Eu6LbGH",oauth_version="1.0"'
)
xhr.setRequestHeader("User-Agent", "PostmanRuntime/7.15.2")
xhr.setRequestHeader("Accept", "*/*")
xhr.setRequestHeader("Cache-Control", "no-cache")
xhr.setRequestHeader(
  "Postman-Token",
  "6267cf1d-64b3-44f1-b26e-ef0d07c2d499,2bf7b8d4-7b71-4898-8b58-37c330015b0c"
)
xhr.setRequestHeader("Host", "api.twitter.com")
xhr.setRequestHeader(
  "Cookie",
  'personalization_id="v1_qdUbfzw93kqDLoOvS5fkUw=="; guest_id=v1%3A156779086412760919'
)
xhr.setRequestHeader("Accept-Encoding", "gzip, deflate")
xhr.setRequestHeader("Content-Length", "")
xhr.setRequestHeader("Connection", "keep-alive")
xhr.setRequestHeader("cache-control", "no-cache")

xhr.send(data)
