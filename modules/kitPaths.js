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

// function to push objected returned to array
const pushToPaths = item => filePaths.push(item)

// function to create new object for URL & pad number
function NewItem(url, pad) {
  this.url = url
  this.pad = pad
}

// global vars
let filePaths = []
let activeKitGlobal

// S3 function to list kit folders
function listFolders(activeKitGlobal) {    
  s3.listObjects({ Delimiter: '/' }, function(err, data) {
    if (err) {
      console.log(err)
    } else {
      let folders = data.CommonPrefixes.map(function (commonPrefix) {
        let prefix = commonPrefix.Prefix
        let folderName = decodeURIComponent(prefix.replace('/', ''))
        let folderKey = encodeURIComponent(folderName) + '/'
        listFiles(folderKey, activeKitGlobal)
      })
    }
  })
}

// S3 function to create and list file paths
function listFiles(folderKey, activeKitGlobal) {
  let newActiveKit = activeKitGlobal + '/'
  s3.listObjects({ Prefix: folderKey }, function (err, data) {
    if (err) {
      console.log(err)
    } else {
      if (data.Prefix === activeKitGlobal + '/') {
        let href = this.request.httpRequest.endpoint.href
        let bucketURL = href + s3BucketName + '/'
        let soundFiles = data.Contents.map(function(soundFile) {
          let fileKey = soundFile.Key
          let fileURL = bucketURL + encodeURIComponent(fileKey)
          fileURL 
          fileURL = fileURL.replace(newActiveKit, '')
          getTags(fileKey, fileURL)
        })
      }
    }
  })
}

// S3 function to get pad assignment within audio object tags
function getTags(fileKey, fileURL) {
  let params = {
    Bucket: s3BucketName,
    Key: fileKey,
  }
  s3.getObjectTagging(params, function (err, data) {
    if (err) {
      console.log(err)
    } else {
      if (data.TagSet.length === 0) {
        return
      } else {
        let padNo = data.TagSet[0].Value
        let x =  new NewItem(fileURL, padNo)
        pushToPaths(x)
      }
    }
  })
}

// updates audio src with S3 file path of kit selected
function setKitPaths(audioElements, filePaths) {
  console.log("***** FILE PATH ARRAY *****")
  console.log(filePaths)
  console.log("***************************")
}

// *** main function export ***

export function setKitPath(activeKit, audioElements) {  
  // set global var to activeKit to pass to S3 functions
  activeKitGlobal = activeKit  
  listFolders(activeKitGlobal)  
  setKitPaths(audioElements, filePaths)
}
  
              // for (let i = 0; i < audioElements.length; i++) {
              //   for (let j = 0; j < filePaths.length; j++) {
              //     console.log(filePaths[i])
              //     if (audioElements[i].src != filePaths[j]) {
              //       audioElements[i].src = filePaths[i]
              //     }
              //   }
              // }

              // // load audio elements after source URLs are updated
              // let kit = document.querySelectorAll('audio')
              // for (let i = 0; i < kit.length; i++) {
              //   kit[i].load()
              // }
  