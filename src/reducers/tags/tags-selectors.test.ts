import { createFilesAndFoldersMetadata } from "../files-and-folders-metadata/files-and-folders-metadata-test-utils";
import { createFilesAndFolders } from "../files-and-folders/files-and-folders-test-utils";
import { StoreState } from "../store";
import { createEmptyStore, wrapStoreWithUndoable } from "../store-test-utils";
import {
  getAllTagIdsForFile,
  getAllTagsForFile,
  getTagByName,
  getTagsByIds,
  getTagsFromStore,
  getTagSize,
  Order,
  sortTags,
  tagMapToArray,
} from "./tags-selectors";
import { Tag } from "./tags-types";

describe("tags-selectors", () => {
  describe("getAllTagIdsForFile", () => {
    it("should return all the tags for the defined ffId", () => {
      const ffId = "test-ffid";
      const foundTagID = "foundTagID";
      const secondFoundTagID = "secondFoundTagID";
      const tags = {
        [foundTagID]: {
          ffIds: [ffId, "fakeFFid"],
          id: foundTagID,
          name: "found",
        },
        unfound: {
          ffIds: ["unwanted", "unwanted2"],
          id: "unfound",
          name: "unfound",
        },
        [secondFoundTagID]: {
          ffIds: [ffId, "fakeFFid2"],
          id: secondFoundTagID,
          name: "found2",
        },
      };

      expect(getAllTagIdsForFile(tags, ffId).sort()).toEqual(
        [foundTagID, secondFoundTagID].sort()
      );
    });
  });

  describe("getAllTagsForFile", () => {
    it("should return all the tags for the defined ffId", () => {
      const ffId = "test-ffid";
      const foundTagID = "foundTagID";
      const foundTag = {
        ffIds: [ffId, "fakeFFid"],
        id: foundTagID,
        name: "found",
      };
      const secondFoundTagID = "secondFoundTagID";
      const secondFoundTag = {
        ffIds: [ffId, "fakeFFid2"],
        id: secondFoundTagID,
        name: "found2",
      };
      const tags = {
        [foundTagID]: foundTag,
        unfound: {
          ffIds: ["unwanted", "unwanted2"],
          id: "2",
          name: "unfound",
        },
        [secondFoundTagID]: secondFoundTag,
      };

      expect(sortTags(getAllTagsForFile(tags, ffId))).toEqual(
        sortTags([foundTag, secondFoundTag])
      );
    });
  });

  describe("getTagsByIds", () => {
    it("should return all the tags for the defined ffId", () => {
      const foundTagID = "foundTagID";
      const secondFoungTagID = "secondFoundTagID";
      const foundTag = {
        ffIds: ["fakeFFid"],
        id: foundTagID,
        name: "found",
      };
      const secondFoundTag = {
        ffIds: ["fakeFFid2"],
        id: secondFoungTagID,
        name: "found2",
      };

      const tags = {
        [foundTagID]: foundTag,
        unfound: {
          ffIds: ["unwanted", "unwanted2"],
          id: "unfound",
          name: "unfound",
        },
        [secondFoungTagID]: secondFoundTag,
      };

      const tagComparator = (tag1: Tag, tag2: Tag): number =>
        tag2.id > tag1.id ? -1 : 1;
      expect(
        getTagsByIds(tags, [foundTagID, secondFoungTagID, "notInMap"]).sort(
          tagComparator
        )
      ).toEqual([foundTag, secondFoundTag].sort(tagComparator));
    });
  });

  describe("getTagByName", () => {
    it("should return undefined if no tag is found", () => {
      const tagMap = {
        unfound: {
          ffIds: ["unwanted", "unwanted2"],
          id: "unfound",
          name: "unfound",
        },
      };

      expect(getTagByName(tagMap, "notContained")).toEqual(undefined);
    });

    it("should return the tag if a tag is found", () => {
      const foundTagID = "foundTagID";
      const foundTagName = "foundTagName";
      const foundTag = {
        ffIds: ["fakeFFid"],
        id: foundTagID,
        name: foundTagName,
      };
      const tagMap = {
        [foundTagID]: foundTag,
        unfound: {
          ffIds: ["unwanted", "unwanted2"],
          id: "unfound",
          name: "unfound",
        },
      };

      expect(getTagByName(tagMap, foundTagName)).toEqual(foundTag);
    });
  });

  describe("sortTags", () => {
    const firstTagId = "3firstTagId";
    const firstTag = {
      ffIds: ["ffid"],
      id: firstTagId,
      name: "1TagName",
    };

    const secondTagId = "2secondTagId";
    const secondTag = {
      ffIds: ["ffid"],
      id: secondTagId,
      name: "2TagName",
    };

    const thirdTagId = "1thirdTagId";
    const thirdTag = {
      ffIds: ["ffid"],
      id: thirdTagId,
      name: "3TagName",
    };
    describe("with default parameter", () => {
      it("should order the tags in asc order based on name field", () => {
        expect(sortTags([secondTag, firstTag, thirdTag])).toEqual([
          firstTag,
          secondTag,
          thirdTag,
        ]);
      });
    });

    describe("with descending order", () => {
      it("should order the tags in desc order based on name field", () => {
        expect(
          sortTags([secondTag, firstTag, thirdTag], { order: Order.DESC })
        ).toEqual([thirdTag, secondTag, firstTag]);
      });
    });

    describe("based on ID", () => {
      it("should order the tags in asc order based on id field", () => {
        expect(
          sortTags([secondTag, firstTag, thirdTag], { sortParam: "id" })
        ).toEqual([thirdTag, secondTag, firstTag]);
      });
    });
  });

  describe("getTagSize", () => {
    it("should return the sum of the tag sizes", () => {
      const tagName = "test-tag-1";
      const taggedFfId = "/folder/ff-id";
      const taggedChildrenFfId = "/folder/ff-id/children";
      const tagId = "test-tag-id";
      const rootId = "";
      const taggedParentSize = 10000;
      const tag = {
        ffIds: [taggedFfId, taggedChildrenFfId],
        id: tagId,
        name: tagName,
      };

      const filesAndFolders = {
        [rootId]: createFilesAndFolders({
          children: [taggedFfId],
          id: "",
        }),
        [taggedFfId]: createFilesAndFolders({
          children: [taggedChildrenFfId],
          id: taggedFfId,
        }),
        [taggedChildrenFfId]: createFilesAndFolders({ id: taggedChildrenFfId }),
      };

      const filesAndFoldersMetadata = {
        [taggedFfId]: createFilesAndFoldersMetadata({
          averageLastModified: 3000,
          childrenTotalSize: taggedParentSize,
          maxLastModified: 10000,
          medianLastModified: 4000,
          minLastModified: 1000,
        }),
        [taggedChildrenFfId]: createFilesAndFoldersMetadata({
          averageLastModified: 3000,
          childrenTotalSize: 1000,
          maxLastModified: 10000,
          medianLastModified: 4000,
          minLastModified: 1000,
        }),
      };

      expect(getTagSize(tag, filesAndFolders, filesAndFoldersMetadata)).toEqual(
        taggedParentSize
      );
    });
  });

  describe("tagMapToArray", () => {
    it("should return the array of tags", () => {
      const tag1Id = "id";
      const tag1 = {
        ffIds: ["ffId"],
        id: tag1Id,
        name: "tag",
      };
      const tag2Id = "id2";
      const tag2 = {
        ffIds: ["ffId"],
        id: tag2Id,
        name: "tag2",
      };
      const tagMap = {
        [tag1Id]: tag1,
        [tag2Id]: tag2,
      };

      expect(sortTags(tagMapToArray(tagMap))).toEqual(sortTags([tag1, tag2]));
    });
  });

  describe("getTagsFromStore", () => {
    it("should return the tag state", () => {
      const tags = {
        id: {
          ffIds: ["ffId"],
          id: "id",
          name: "name",
        },
      };

      const tagState = {
        tags,
      };

      const emptyStore = createEmptyStore();
      const storeState: StoreState = {
        ...emptyStore,
        tags: wrapStoreWithUndoable(tagState),
      };

      expect(getTagsFromStore(storeState)).toEqual(tags);
    });
  });
});
