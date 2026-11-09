import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import { api } from './api';
import type { RequestDetail } from './types';
const first: RequestDetail = { id: '1', municipality: 'Fjordby', projectTitle: 'School renovation',
  description: 'School insulation.', budgetAttached: false, status: 'New', activity: [], readiness: null };
const second: RequestDetail = { ...first, id: '2', municipality: 'Sødal', projectTitle: 'Library refurbishment' };
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
});
