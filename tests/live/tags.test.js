'use strict';
const TogglClient = require('../../');
const { describeLive, workspaceId } = require('../helpers/live');

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

describeLive('Testing Tags', () => {
  let togglClient
  const tagName = 'node-toggl-api test tag'

  beforeEach(() => {
    togglClient = new TogglClient({ apiToken: process.env.API_TOKEN });
  });

  it('should create a tag, find it, rename it and delete it', async () => {
    const leftovers = (await togglClient.getTags(workspaceId))
      .filter(tag => tag.name === tagName || tag.name === tagName + ' updated')
    for (const tag of leftovers) {
      await togglClient.deleteTag(workspaceId, tag.id)
    }

    const tag = await togglClient.createTag(workspaceId, tagName)
    expect(tag).toHaveProperty('id');
    expect(tag.name).toBe(tagName);

    const found = await togglClient.getTags(workspaceId, { search: tagName })
    expect(found.map(t => t.id)).toContain(tag.id)

    const updatedTag = await togglClient.updateTagName(workspaceId, tag.id, tagName + ' updated')
    expect(updatedTag).toHaveProperty('name', tagName + ' updated');

    await togglClient.deleteTag(workspaceId, tag.id)
    await sleep(300)
    const tagsAfterDelete = await togglClient.getTags(workspaceId)
    expect(tagsAfterDelete.map(t => t.id)).not.toContain(tag.id)
  })

  it('should add and remove tags of time entries', async () => {
    const timeEntry = await togglClient.startTimeEntry({ workspace_id: workspaceId, description: 'Tag test' })
    const other = await togglClient.startTimeEntry({ workspace_id: workspaceId, description: 'Tag test 2' })

    try {
      const tags = ['node-toggl-api tag1', 'node-toggl-api tag2']
      await togglClient.addTimeEntryTags(workspaceId, timeEntry.id, tags)
      expect((await togglClient.getTimeEntryData(timeEntry.id)).tags.sort()).toEqual(tags)

      await togglClient.removeTimeEntryTags(workspaceId, timeEntry.id, [tags[0]])
      expect((await togglClient.getTimeEntryData(timeEntry.id)).tags).toEqual([tags[1]])

      await togglClient.addTimeEntriesTags(workspaceId, [timeEntry.id, other.id], [tags[0]])
      expect((await togglClient.getTimeEntryData(other.id)).tags).toEqual([tags[0]])

      await togglClient.removeTimeEntriesTags(workspaceId, [timeEntry.id, other.id], tags)
      expect((await togglClient.getTimeEntryData(timeEntry.id)).tags).toEqual([])
      expect((await togglClient.getTimeEntryData(other.id)).tags).toEqual([])

      const allTags = await togglClient.getTags(workspaceId)
      for (const tag of allTags.filter(t => tags.includes(t.name))) {
        await togglClient.deleteTag(workspaceId, tag.id)
      }
    } finally {
      await togglClient.deleteTimeEntry(workspaceId, timeEntry.id)
      await togglClient.deleteTimeEntry(workspaceId, other.id)
    }
  })
});
