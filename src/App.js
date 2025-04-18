import PostMain from "./PostMain";
import VideoUploader from "./VideoUploader";
import VideoUploaderS3 from "./VideoUploaderS3";

function App() {
  return (
    <>
      <PostMain/>
      <VideoUploader/>
      <VideoUploaderS3/>
    </>
  );
}

export default App;
