const kitAPaths = [
  'https://mcb-bucket-js.s3-us-west-1.amazonaws.com/kit_a/kick.wav',
  'https://mcb-bucket-js.s3-us-west-1.amazonaws.com/kit_a/hihat.wav',
  'https://mcb-bucket-js.s3-us-west-1.amazonaws.com/kit_a/clap.wav',
  'https://mcb-bucket-js.s3-us-west-1.amazonaws.com/kit_a/openhat.wav',
  'https://mcb-bucket-js.s3-us-west-1.amazonaws.com/kit_a/boom.wav',
  'https://mcb-bucket-js.s3-us-west-1.amazonaws.com/kit_a/ride.wav',
  'https://mcb-bucket-js.s3-us-west-1.amazonaws.com/kit_a/snare.wav',
  'https://mcb-bucket-js.s3-us-west-1.amazonaws.com/kit_a/tom.wav',
  'https://mcb-bucket-js.s3-us-west-1.amazonaws.com/kit_a/tink.wav',
]

const kitBPaths = [
  'https://mcb-bucket-js.s3-us-west-1.amazonaws.com/kit_b/kick.wav',
  'https://mcb-bucket-js.s3-us-west-1.amazonaws.com/kit_b/hihat.wav',
  'https://mcb-bucket-js.s3-us-west-1.amazonaws.com/kit_b/clap.wav',
  'https://mcb-bucket-js.s3-us-west-1.amazonaws.com/kit_b/openhat.wav',
  'https://mcb-bucket-js.s3-us-west-1.amazonaws.com/kit_b/boom.wav',
  'https://mcb-bucket-js.s3-us-west-1.amazonaws.com/kit_b/ride.wav',
  'https://mcb-bucket-js.s3-us-west-1.amazonaws.com/kit_b/snare.wav',
  'https://mcb-bucket-js.s3-us-west-1.amazonaws.com/kit_b/tom.wav',
  'https://mcb-bucket-js.s3-us-west-1.amazonaws.com/kit_b/tink.wav',
]

const kitCPaths = [
  'https://mcb-bucket-js.s3-us-west-1.amazonaws.com/kit_c/kick.wav',
  'https://mcb-bucket-js.s3-us-west-1.amazonaws.com/kit_c/hihat.wav',
  'https://mcb-bucket-js.s3-us-west-1.amazonaws.com/kit_c/clap.wav',
  'https://mcb-bucket-js.s3-us-west-1.amazonaws.com/kit_c/openhat.wav',
  'https://mcb-bucket-js.s3-us-west-1.amazonaws.com/kit_c/boom.wav',
  'https://mcb-bucket-js.s3-us-west-1.amazonaws.com/kit_c/ride.wav',
  'https://mcb-bucket-js.s3-us-west-1.amazonaws.com/kit_c/snare.wav',
  'https://mcb-bucket-js.s3-us-west-1.amazonaws.com/kit_c/tom.wav',
  'https://mcb-bucket-js.s3-us-west-1.amazonaws.com/kit_c/tink.wav',
]

function setFilePaths(filepaths, urls) {
  for (let i = 0; i < filepaths.length; i++) {
    urls.push(filepaths[i])
  }
}

export function setKitPath(activeKit, urls) {  
  switch (activeKit) {
    case 'kit_a':
      setFilePaths(kitAPaths, urls)
      break
    case 'kit_b':
      setFilePaths(kitBPaths, urls)
      break
    case 'kit_c':
      setFilePaths(kitCPaths, urls)
      break
    default:
      console.log('Not found')
      break
  }   
}