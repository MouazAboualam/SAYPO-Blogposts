import {definePlugin} from 'sanity'


export const dashboardTool = definePlugin({
  name: 'quick-dashboard',
  tools: [
    {
      title: '📊 Quick Dashboard',
      name: 'dashboard',
      component: () => (
        <div style={{padding: '32px', maxWidth: '600px'}}>
          <h1>📊 Quick Dashboard</h1>
          <p>Welcome to your content command center.</p>
          <ul style={{marginTop: '16px', lineHeight: '1.8'}}>
            <li>📝 Create a new post → Click "Blog Post" in sidebar</li>
            <li>
              🌍 View live posts → Check <code>https://your-frontend.com/blog</code>
            </li>
            <li>
              🚀 Deploy Studio → Run <code>npx sanity deploy</code>
            </li>
            <li>
              📦 Export AI data → Use CLI: <code>sanity dataset export</code>
            </li>
          </ul>
        </div>
        
      ),
      
    },
  ],
})
