<script>
  import { preventDefault } from 'svelte/legacy';

  import Checkbox from '~components/Checkbox';
  import Button from '~components/Button';
  import { modals, torrents, alerts, selectedTorrents } from '~helpers/stores';

  let loading = $state(false);
  let deleteData = $state(false);

  const term = $selectedTorrents.length > 1 ? 'torrent' : 'torrents';

  const handleRemove = () => {
    if (loading) return;

    loading = true;
    if (!$selectedTorrents.length) {
      loading = false;
      alerts.add('Select at least one torrent to continue', 'negative');
      return;
    }
    torrents
      .remove($selectedTorrents, deleteData)
      .then(() => {
        torrents.set(
          $torrents.filter((t) => !$selectedTorrents.includes(t.id))
        );
        alerts.add(`Succesfully removed ${$selectedTorrents.length} ${term}`);
        selectedTorrents.clear();
        modals.close();
      })
      .catch(() => {
        alerts.add(`Failed to remove ${term}`, 'negative');
      });
  };
</script>

<h1>Remove torrents</h1>

<div class="content">
  <form onsubmit={preventDefault(handleRemove)}>
    <p>Are you sure you want to remove {$selectedTorrents.length} {term}?</p>
    <Checkbox label="Delete local data" bind:checked={deleteData} />
    <div class="button-group">
      <Button priority="tertiary" onclick={modals.close}>Cancel</Button>
      <Button priority="primary" loading={loading} type="submit">
        Remove torrents
      </Button>
    </div>
  </form>
</div>

<style>
  h1 {
    color: var(--color-modal-header);
    font-size: 20px;
    font-weight: 500;
    padding: 20px 25px 0;
  }

  .content {
    overflow-y: auto;
    padding: 20px 25px 20px 25px;
    color: var(--color-modal-text);
  }

  .button-group {
    display: flex;
    justify-content: flex-end;
    margin-top: 25px;
    gap: 10px;
  }

  p {
    font-size: 14px;
    margin-bottom: 15px;
  }
</style>
