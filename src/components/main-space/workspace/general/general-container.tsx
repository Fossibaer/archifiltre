import React, { FC, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getFilesAndFoldersMetadataFromStore } from "reducers/files-and-folders-metadata/files-and-folders-metadata-selectors";
import {
  getFileCount,
  getFilesAndFoldersFromStore,
  getFoldersCount,
} from "reducers/files-and-folders/files-and-folders-selectors";
import { getWorkspaceMetadataFromStore } from "reducers/workspace-metadata/workspace-metadata-selectors";
import { setSessionNameThunk } from "reducers/workspace-metadata/workspace-metadata-thunk";
import General from "components/main-space/workspace/general/general";

const GeneralContainer: FC = () => {
  const filesAndFolders = useSelector(getFilesAndFoldersFromStore);

  const dispatch = useDispatch();

  const { sessionName } = useSelector(getWorkspaceMetadataFromStore);

  const setSessionName = useCallback(
    (newSessionName) => dispatch(setSessionNameThunk(newSessionName)),
    [dispatch]
  );

  const nbFiles = useMemo(() => getFileCount(filesAndFolders), [
    filesAndFolders,
  ]);
  const nbFolders = useMemo(() => getFoldersCount(filesAndFolders), [
    filesAndFolders,
  ]);
  const metadata = useSelector(getFilesAndFoldersMetadataFromStore);
  const rootFilesAndFoldersMetadata = metadata[""] || {};

  const volume = rootFilesAndFoldersMetadata.childrenTotalSize;
  const oldestFileTimestamp = rootFilesAndFoldersMetadata.minLastModified;
  const newestFileTimestamp = rootFilesAndFoldersMetadata.maxLastModified;

  return (
    <General
      filesAndFolders={filesAndFolders}
      sessionName={sessionName}
      setSessionName={setSessionName}
      nbFiles={nbFiles}
      nbFolders={nbFolders}
      volume={volume}
      oldestFileTimestamp={oldestFileTimestamp}
      newestFileTimestamp={newestFileTimestamp}
    />
  );
};

export default GeneralContainer;
