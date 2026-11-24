import { Platform, PermissionsAndroid } from "react-native";

/**
 * Request file/document access permissions
 * 
 * iOS: Permissions are handled via Info.plist entries:
 * - UIFileSharingEnabled: Allows file sharing
 * - LSSupportsOpeningDocumentsInPlace: Allows opening documents in place
 * - NSPhotoLibraryUsageDescription: For reading from photo library
 * - NSPhotoLibraryAddUsageDescription: For saving to photo library
 * 
 * Android: Runtime permissions required based on API level
 * - API 33+: READ_MEDIA_IMAGES
 * - API < 33: READ_EXTERNAL_STORAGE
 */
export async function requestFilePermission(): Promise<boolean> {
    if (Platform.OS !== "android") {
        // iOS permissions are handled via Info.plist
        console.log("[File Permissions] iOS: Using Info.plist permissions");
        return true;
    }

    try {
        // Android 13+ (API 33)
        if (Platform.Version >= 33) {
            console.log("[File Permissions] Android API 33+: Requesting READ_MEDIA_IMAGES");
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
            );
            const isGranted = granted === PermissionsAndroid.RESULTS.GRANTED;
            console.log(`[File Permissions] READ_MEDIA_IMAGES: ${isGranted ? 'GRANTED' : 'DENIED'}`);
            return isGranted;
        }

        // Android 12 and below
        console.log("[File Permissions] Android API < 33: Requesting READ_EXTERNAL_STORAGE");
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
        );
        const isGranted = granted === PermissionsAndroid.RESULTS.GRANTED;
        console.log(`[File Permissions] READ_EXTERNAL_STORAGE: ${isGranted ? 'GRANTED' : 'DENIED'}`);
        return isGranted;
    } catch (error) {
        console.error("[File Permissions] Error requesting permissions:", error);
        return false;
    }
}

