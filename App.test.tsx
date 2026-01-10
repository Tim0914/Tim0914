import { render, screen } from '@testing-library/react';
import App from './App';
import { describe, it, expect } from 'vitest';

describe('App Component', () => {
    it('renders without crashing', () => {
        render(<App />);
        // 您可以根據實際的 UI 內容調整這裡的測試條件
        // 例如檢查標題是否存在
        // const titleElement = screen.getByText(/抽籤小幫手/i);
        // expect(titleElement).toBeInTheDocument();
        expect(document.body).toBeInTheDocument();
    });
});
