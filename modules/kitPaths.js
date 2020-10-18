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

function NewItem(url, pad) {
  this.url = url
  this.pad = pad
}

// *** main function export ***

// returns an array of file paths from S3 to update the DOM

export function setKitPath(activeKit, audioElements) {
  // set var to return array of file paths from S3
  let filePaths = {}

  // add slash to activeKit value for later S3 return comparison
  let newActiveKit = activeKit + '/'

  // S3 code to list folders in bucket
  s3.listObjects({ Delimiter: '/' }, function (err, data) {
    if (err) {
      // future dev: redirect to fallback audio source (GitHub, etc)
      // set as function or re-direct user back to app.js ?
      console.log(err)
    } else {
      let folders = data.CommonPrefixes.map(function (commonPrefix) {
        let prefix = commonPrefix.Prefix
        let folderName = decodeURIComponent(prefix.replace('/', ''))
        let folderKey = encodeURIComponent(folderName) + '/'

        // S3 code to list files in folders
        s3.listObjects({ Prefix: folderKey }, function (err, data) {
          // future dev: redirect to fallback audio source (GitHub, etc)
          if (err) {
            console.log(err)
          } else {
            // logic to select S3 folder based on user kit selection and set file paths
            if (data.Prefix === activeKit + '/') {
              // "this" refers to data.Prefix in this instance
              let href = this.request.httpRequest.endpoint.href
              let bucketURL = href + s3BucketName + '/'
              let soundFiles = data.Contents.map(function (soundFile) {
                let fileKey = soundFile.Key
                let fileURL = bucketURL + encodeURIComponent(fileKey)
                fileURL = fileURL.replace('%2F', '/')
                let fileName = fileKey.replace(newActiveKit, '')

                let params = {
                  Bucket: s3BucketName,
                  Key: fileKey,
                }                

                // code to get pad values from tags in s3 files
                s3.getObjectTagging(params, function (err, data) {
                  if (err) {
                    console.log(err)
                  } else {
                    if (data.TagSet.length === 0) {
                      return
                    } else {
                      
                      let padNo = data.TagSet[0].Value
                      let x = new NewItem(fileURL, padNo)
                      console.log(x)
                      // filePaths.push(x)  
                    }
                  }
                })                
              })

              for (let i = 0; i < audioElements.length; i++) {
                for (let j = 0; j < filePaths.length; j++) {
                  console.log(filePaths[i])
                  if (audioElements[i].src != filePaths[j]) {
                    audioElements[i].src = filePaths[i]
                  }
                }
              }

              // load audio elements after source URLs are updated
              let kit = document.querySelectorAll('audio')
              for (let i = 0; i < kit.length; i++) {
                kit[i].load()
              }
            }
          }
        })
      })
    }
  })
  // console.log(Object(filePaths.pathData))
  console.log(filePaths)

  // let array = [
  //   { url: 'http://www.site1.com', pad: '2' },
  //   { url: 'http://www.site2.com', pad: '3' },
  //   { url: 'http://www.site3.com', pad: '4' },
  // ]

  // console.log(array)





}
