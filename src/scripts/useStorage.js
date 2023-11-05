import { ref } from 'vue';
import { storage } from '../firebase/config';
import { ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

const useStorage = () => {
    const error = ref(null);
  
    // url for download the image
    const url = ref(null);
  
    // Path for firestore
    const filePath = ref(null);
  
    const uploadImage = async (file, path) => {
      url.value = null
      filePath.value = `${path}/${file.name}`;
      const storageReference = storageRef(storage, filePath.value); 
      try {
        // upload the file
        await uploadBytes(storageReference, file); 
        url.value = await getDownloadURL(storageReference);
      } catch (err) {
        console.error(err)
        throw new Error(err)
      }
    };

    // Delete the file by url
    const delete_image_by_url = async imageUrl => {
      const storageReference = storageRef(storage, imageUrl);
      try {
        await deleteObject(storageReference);
      } catch (err) {
        console.error(err)
        throw new Error(err)
      }
    };

    return {
        error,
        url,
        filePath,
        uploadImage,
        delete_image_by_url,
    }
}

export default useStorage;
