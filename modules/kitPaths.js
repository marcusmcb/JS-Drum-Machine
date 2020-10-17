// *** S3 SDK config ***

var s3BucketName = 'jsp-1'

AWS.config.region = 'us-west-2' // Region
AWS.config.credentials = new AWS.CognitoIdentityCredentials({
  IdentityPoolId: 'us-west-2:d8f462c8-e5e1-4b21-a7f4-0ba287bba05f',
})

// create a new S3 service object
var s3 = new AWS.S3({
  apiVersion: '2006-03-01',
  params: { Bucket: s3BucketName },
})

let filePaths = []
let fileUrl

function setArray(fileUrl) {
  filePaths.push(fileUrl) 
}

// main function export
export function setKitPath(activeKit, urls) {
  
  // set var to return array of file paths from S3
  // let filePaths = []

  // add slash to activeKit value for later S3 return comparison
  let newActiveKit = activeKit + '/'
  console.log(`NEW ACTIVE KIT: ${newActiveKit}`)
  
  // S3 code to list folders in bucket
  s3.listObjects({ Delimiter: '/' }, function (err, data) {
    if (err) {
      console.log(err)
    } else {
      console.log(data)      
      let folders = data.CommonPrefixes.map(function (commonPrefix) {
        let prefix = commonPrefix.Prefix
        let folderName = decodeURIComponent(prefix.replace('/', ''))
        let folderKey = encodeURIComponent(folderName) + '/'
        
        // S3 code to list files in folders
        s3.listObjects({ Prefix: folderKey }, function (err, data) {
          if (err) {
            console.log(err)
          } else {
            
            // logic to select S3 folder based on user kit selection and set filepath array accordingly
            if (data.Prefix === activeKit + '/') {

              // let temp = data.Contents
              // console.log(temp)
              // "this" refers to data.Prefix in this instance
              let href = this.request.httpRequest.endpoint.href
              let bucketUrl = href + s3BucketName + '/'
              let soundFiles = data.Contents.map(function (soundFile) {
                let fileKey = soundFile.Key
                let fileUrl = bucketUrl + encodeURIComponent(fileKey)
                fileUrl.toString()
                // console.log(fileUrl)
                setArray(fileUrl)                               
              })
            }
          }
        })
      })                 
    }
  })
  console.log(filePaths)
  console.log(typeof filePaths)    
}