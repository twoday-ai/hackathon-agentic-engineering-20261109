import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import { api } from './api';
import type { RequestDetail } from './types';
const first: RequestDetail = { id: '1', municipality: 'Fjordby', projectTitle: 'School renovation',
  description: 'School insulation.', budgetAttached: false, status: 'New', activity: [], readiness: null };
const second: RequestDetail = { ...first, id: '2', municipality: 'Sødal', projectTitle: 'Library refurbishment' };
const third: RequestDetail = { ...first, id: '3', municipality: 'Vesteng', projectTitle: '', description: 'Sports centre.' };
function setup() {
  vi.spyOn(api, 'list').mockResolvedValue([first, second]);
  vi.spyOn(api, 'detail').mockImplementation(async id => structuredClone(id === '1' ? first : second));
  return userEvent.setup();
}
it('selects different requests and displays the correct details', async () => {
  const user = setup(); render(<App />);
  await user.click(await screen.findByRole('button', { name: /Fjordby/ }));
  const panel = screen.getByRole('article', { name: 'Request details' });
  expect(await within(panel).findByRole('heading', { name: 'School renovation' })).toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: /Sødal/ }));
  expect(await within(panel).findByRole('heading', { name: 'Library refurbishment' })).toBeInTheDocument();
});
it('shows a useful API error', async () => {
  setup(); vi.mocked(api.list).mockRejectedValue(new Error('API unavailable.'));
  render(<App />); expect(await screen.findByRole('alert')).toHaveTextContent('API unavailable.');
  expect(screen.queryByText('No matching requests')).not.toBeInTheDocument();
  expect(screen.queryByText('No requests yet.')).not.toBeInTheDocument();
});

it('filters loaded requests by municipality or title and keeps the original order when cleared', async () => {
  const user = setup();
  vi.mocked(api.list).mockResolvedValue([first, second, third]);
  render(<App />);
  await screen.findByRole('button', { name: /Fjordby/ });
  const search = screen.getByRole('searchbox', { name: 'Search requests' });
  const list = within(screen.getByRole('list'));
  const examples = [
    { query: '  FJORD  ', row: /Fjordby/ },
    { query: 'REFURB', row: /Sødal/ },
    { query: 'SØDAL', row: /Sødal/ },
    { query: 'VEST', row: /Vesteng/ },
  ];
  for (const { query, row } of examples) {
    await user.clear(search);
    await user.type(search, query);
    expect(list.getAllByRole('button')).toEqual([list.getByRole('button', { name: row })]);
    expect(screen.getByRole('status')).toHaveTextContent(/^1 matching request$/);
  }
  await user.clear(search);
  await user.type(search, 're');
  expect(list.getAllByRole('button')).toHaveLength(2);
  expect(screen.getByRole('status')).toHaveTextContent(/^2 matching requests$/);
  for (const query of ['sports centre', 'project title missing', 'Sodal', 'zzz']) {
    await user.clear(search);
    await user.type(search, query);
    expect(list.queryByRole('button')).not.toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent(/^No matching requests$/);
  }
  await user.clear(search);
  await user.type(search, '   ');
  expect(screen.queryByRole('status')).not.toBeInTheDocument();
  expect(list.getAllByRole('button')).toEqual([
    list.getByRole('button', { name: /Fjordby/ }),
    list.getByRole('button', { name: /Sødal/ }),
    list.getByRole('button', { name: /Vesteng/ }),
  ]);
  expect(api.list).toHaveBeenCalledTimes(1);
  expect(api.detail).not.toHaveBeenCalled();
});

it('keeps the open request when hidden and restores its selected row on clear', async () => {
  const user = setup(); render(<App />);
  await user.click(await screen.findByRole('button', { name: /Fjordby/ }));
  const panel = within(screen.getByRole('article', { name: 'Request details' }));
  await panel.findByRole('heading', { name: 'School renovation' });
  const search = screen.getByRole('searchbox', { name: 'Search requests' });
  await user.type(search, 'library');
  expect(screen.queryByRole('button', { name: /Fjordby/ })).not.toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Sødal/, pressed: false })).toBeInTheDocument();
  expect(panel.getByRole('heading', { name: 'School renovation' })).toBeInTheDocument();
  expect(panel.getByRole('status')).toHaveTextContent('The open request is outside the current search results.');
  await user.click(screen.getByRole('button', { name: 'Clear search' }));
  expect(search).toHaveValue('');
  expect(search).toHaveFocus();
  expect(screen.getByRole('button', { name: /Fjordby/, pressed: true })).toBeInTheDocument();
  expect(panel.queryByRole('status')).not.toBeInTheDocument();
  expect(api.list).toHaveBeenCalledTimes(1);
  expect(api.detail).toHaveBeenCalledTimes(1);
});

it('shows the empty list message when no requests have loaded', async () => {
  const user = setup();
  vi.mocked(api.list).mockResolvedValue([]);
  render(<App />);
  await screen.findByText('No requests yet.');
  await user.type(screen.getByRole('searchbox', { name: 'Search requests' }), 'library');
  expect(screen.getByText('No requests yet.')).toBeInTheDocument();
  expect(screen.queryByText('No matching requests')).not.toBeInTheDocument();
});
