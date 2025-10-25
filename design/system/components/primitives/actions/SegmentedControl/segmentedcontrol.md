<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SegmentedControl Radius System</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      padding: 40px 20px;
    }

    .container {
      max-width: 1000px;
      margin: 0 auto;
    }

    .header {
      text-align: center;
      color: white;
      margin-bottom: 50px;
    }

    .header h1 {
      font-size: 42px;
      font-weight: 700;
      margin-bottom: 10px;
      text-shadow: 0 2px 10px rgba(0,0,0,0.2);
    }

    .header p {
      font-size: 18px;
      opacity: 0.9;
    }

    .section {
      background: white;
      border-radius: 20px;
      padding: 40px;
      margin-bottom: 30px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.1);
    }

    .section h2 {
      font-size: 28px;
      font-weight: 600;
      margin-bottom: 20px;
      color: #1a202c;
    }

    .section h3 {
      font-size: 20px;
      font-weight: 600;
      margin: 30px 0 15px;
      color: #2d3748;
    }

    .info-box {
      background: #f7fafc;
      border-left: 4px solid #667eea;
      padding: 20px;
      margin: 20px 0;
      border-radius: 8px;
    }

    .info-box h4 {
      font-size: 16px;
      font-weight: 600;
      color: #2d3748;
      margin-bottom: 10px;
    }

    .info-box p {
      color: #4a5568;
      line-height: 1.6;
      margin-bottom: 10px;
    }

    .info-box code {
      background: #edf2f7;
      padding: 2px 6px;
      border-radius: 4px;
      font-family: 'Monaco', monospace;
      font-size: 13px;
      color: #667eea;
    }

    .radius-demo-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin: 30px 0;
    }

    .radius-demo-item {
      text-align: center;
    }

    .radius-demo-item h4 {
      font-size: 14px;
      font-weight: 600;
      color: #4a5568;
      margin-bottom: 15px;
    }

    .radius-label {
      font-size: 12px;
      color: #718096;
      margin-top: 10px;
      font-family: 'Monaco', monospace;
    }

    /* Segmented Control Styles */
    .segmented-control {
      position: relative;
      display: inline-flex;
      background: #e2e8f0;
      border: 1px solid #cbd5e0;
      padding: 4px;
      overflow: hidden;
      isolation: isolate;
      gap: 0;
      box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.05);
      width: 100%;
      max-width: 280px;
    }

    .segmented-control__indicator {
      position: absolute;
      top: 4px;
      left: 4px;
      bottom: 4px;
      background: white;
      box-shadow: 
        0 1px 3px rgba(0, 0, 0, 0.12),
        0 1px 2px rgba(0, 0, 0, 0.08),
        0 0 0 1px rgba(0, 0, 0, 0.05);
      transition: 
        transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1),
        width 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
      z-index: 1;
      height: auto;
    }

    .segmented-control__option {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      background: transparent;
      border: none;
      cursor: pointer;
      transition: all 0.15s ease;
      z-index: 2;
      min-width: 0;
      flex: 1;
      padding: 10px 16px;
      box-sizing: border-box;
      text-align: center;
      white-space: nowrap;
      font-size: 14px;
      font-weight: 500;
      color: #718096;
    }

    .segmented-control__option.active {
      color: #1a202c;
      font-weight: 600;
    }

    /* Radius variants */
    .radius-xs .segmented-control {
      border-radius: 2px;
    }
    .radius-xs .segmented-control__indicator,
    .radius-xs .segmented-control__option {
      border-radius: 1px;
    }

    .radius-sm .segmented-control {
      border-radius: 4px;
    }
    .radius-sm .segmented-control__indicator,
    .radius-sm .segmented-control__option {
      border-radius: 2px;
    }

    .radius-md .segmented-control {
      border-radius: 6px;
    }
    .radius-md .segmented-control__indicator,
    .radius-md .segmented-control__option {
      border-radius: 4px;
    }

    .radius-lg .segmented-control {
      border-radius: 8px;
    }
    .radius-lg .segmented-control__indicator,
    .radius-lg .segmented-control__option {
      border-radius: 6px;
    }

    .radius-xl .segmented-control {
      border-radius: 12px;
    }
    .radius-xl .segmented-control__indicator,
    .radius-xl .segmented-control__option {
      border-radius: 8px;
    }

    .radius-pill .segmented-control,
    .radius-pill .segmented-control__indicator,
    .radius-pill .segmented-control__option {
      border-radius: 9999px;
    }

    /* Comparison table */
    .comparison-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 20px;
    }

    .comparison-table th,
    .comparison-table td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #e2e8f0;
    }

    .comparison-table th {
      background: #f7fafc;
      font-weight: 600;
      color: #2d3748;
      font-size: 14px;
    }

    .comparison-table td {
      color: #4a5568;
      font-size: 14px;
    }

    .comparison-table code {
      background: #edf2f7;
      padding: 2px 6px;
      border-radius: 4px;
      font-family: 'Monaco', monospace;
      font-size: 12px;
      color: #667eea;
    }

    @media (max-width: 640px) {
      .section {
        padding: 25px;
      }
      
      .radius-demo-grid {
        grid-template-columns: 1fr;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📐 SegmentedControl Radius System</h1>
      <p>How your design system's radius scale works with SegmentedControl</p>
    </div>

    <!-- RADIUS SYSTEM OVERVIEW -->
    <div class="section">
      <h2>🎨 Design System Integration</h2>
      
      <div class="info-box">
        <h4>✅ Radius Tokens Used</h4>
        <p>SegmentedControl now uses the <strong>same radius tokens as your buttons</strong>, ensuring perfect consistency across your entire design system:</p>
        <ul style="margin-top: 10px; padding-left: 20px; color: #4a5568; line-height: 1.8;">
          <li><code>--radius-button</code> for container (default size)</li>
          <li><code>--radius-button-sm</code> for indicator & small size</li>
          <li><code>--radius-button-lg</code> for large size</li>
          <li><code>--radius-pill</code> for pill variant</li>
        </ul>
      </div>

      <div class="info-box">
        <h4>🔄 Respects User's Radius Scale</h4>
        <p>When users change their radius scale preference (None, XS, SM, MD, LG, XL, 2XL, Full), the SegmentedControl automatically adapts because it references your semantic tokens:</p>
        <p style="margin-top: 10px; font-size: 13px;">
          <code>--radius-button</code> → <code>--selected-radius-scale-sm</code> → User's chosen scale
        </p>
      </div>
    </div>

    <!-- VISUAL EXAMPLES -->
    <div class="section">
      <h2>👁️ Visual Examples</h2>
      <p style="color: #4a5568; margin-bottom: 30px;">
        Here's how the SegmentedControl looks at different radius scales (simulating your user's radius preferences):
      </p>

      <div class="radius-demo-grid">
        <div class="radius-demo-item radius-xs">
          <h4>None/XS Scale</h4>
          <div class="segmented-control" id="xs-control">
            <div class="segmented-control__indicator" id="xs-indicator"></div>
            <button class="segmented-control__option active" data-index="0">☀️ Light</button>
            <button class="segmented-control__option" data-index="1">🌙 Dark</button>
          </div>
          <div class="radius-label">Very subtle corners</div>
        </div>

        <div class="radius-demo-item radius-sm">
          <h4>SM Scale (Default)</h4>
          <div class="segmented-control" id="sm-control">
            <div class="segmented-control__indicator" id="sm-indicator"></div>
            <button class="segmented-control__option active" data-index="0">☀️ Light</button>
            <button class="segmented-control__option" data-index="1">🌙 Dark</button>
          </div>
          <div class="radius-label">Balanced roundedness</div>
        </div>

        <div class="radius-demo-item radius-md">
          <h4>MD Scale</h4>
          <div class="segmented-control" id="md-control">
            <div class="segmented-control__indicator" id="md-indicator"></div>
            <button class="segmented-control__option active" data-index="0">☀️ Light</button>
            <button class="segmented-control__option" data-index="1">🌙 Dark</button>
          </div>
          <div class="radius-label">Moderate rounding</div>
        </div>

        <div class="radius-demo-item radius-lg">
          <h4>LG Scale</h4>
          <div class="segmented-control" id="lg-control">
            <div class="segmented-control__indicator" id="lg-indicator"></div>
            <button class="segmented-control__option active" data-index="0">☀️ Light</button>
            <button class="segmented-control__option" data-index="1">🌙 Dark</button>
          </div>
          <div class="radius-label">More rounded</div>
        </div>

        <div class="radius-demo-item radius-xl">
          <h4>XL Scale</h4>
          <div class="segmented-control" id="xl-control">
            <div class="segmented-control__indicator" id="xl-indicator"></div>
            <button class="segmented-control__option active" data-index="0">☀️ Light</button>
            <button class="segmented-control__option" data-index="1">🌙 Dark</button>
          </div>
          <div class="radius-label">Very rounded</div>
        </div>

        <div class="radius-demo-item radius-pill">
          <h4>Pill Variant (Any Scale)</h4>
          <div class="segmented-control" id="pill-control">
            <div class="segmented-control__indicator" id="pill-indicator"></div>
            <button class="segmented-control__option active" data-index="0">☀️ Light</button>
            <button class="segmented-control__option" data-index="1">🌙 Dark</button>
          </div>
          <div class="radius-label">Fully circular ends</div>
        </div>
      </div>
    </div>

    <!-- TECHNICAL DETAILS -->
    <div class="section">
      <h2>🔧 Technical Details</h2>
      
      <h3>Radius Token Mapping</h3>
      <table class="comparison-table">
        <thead>
          <tr>
            <th>Size</th>
            <th>Container</th>
            <th>Indicator & Options</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Small</strong></td>
            <td><code>--radius-button-sm</code></td>
            <td><code>--radius-xs</code></td>
          </tr>
          <tr>
            <td><strong>Medium (default)</strong></td>
            <td><code>--radius-button</code></td>
            <td><code>--radius-button-sm</code></td>
          </tr>
          <tr>
            <td><strong>Large</strong></td>
            <td><code>--radius-button-lg</code></td>
            <td><code>--radius-button</code></td>
          </tr>
          <tr>
            <td><strong>Pill variant</strong></td>
            <td><code>--radius-pill</code></td>
            <td><code>--radius-pill</code></td>
          </tr>
        </tbody>
      </table>

      <h3>Why Indicator Has Smaller Radius</h3>
      <div class="info-box">
        <p>The sliding indicator uses a slightly smaller radius than the container to create visual separation and the "floating" effect. This is a deliberate design choice that works across all radius scales.</p>
      </div>

      <h3>Consistency with Form Elements</h3>
      <div class="info-box">
        <p>Since SegmentedControl uses <code>--radius-button</code> tokens, it automatically matches your buttons, inputs, and other form elements. When displayed together in a form, everything will have harmonious corner radii!</p>
      </div>
    </div>

    <!-- RECOMMENDATIONS -->
    <div class="section">
      <h2>💡 Recommendations</h2>
      
      <div class="info-box">
        <h4>For Theme Controls (your use case)</h4>
        <p>Use <strong>variant="default"</strong> with <strong>size="md"</strong>. This provides the best balance of visibility and usability, and matches your button styling perfectly.</p>
      </div>

      <div class="info-box">
        <h4>When to Use Pill Variant</h4>
        <p>The pill variant works great when:</p>
        <ul style="margin-top: 10px; padding-left: 20px; color: #4a5568; line-height: 1.8;">
          <li>You have only 2-3 options with short labels</li>
          <li>You want a more modern, playful appearance</li>
          <li>You're using it in a marketing or landing page context</li>
        </ul>
        <p style="margin-top: 10px;">⚠️ Note: Pill variant always uses <code>--radius-pill</code> (9999px) regardless of the user's radius scale, as that's its defining characteristic.</p>
      </div>
    </div>
  </div>

  <script>
    // Interactive demo setup
    const controls = ['xs', 'sm', 'md', 'lg', 'xl', 'pill'];
    
    controls.forEach(id => {
      const control = document.getElementById(`${id}-control`);
      const indicator = document.getElementById(`${id}-indicator`);
      const options = control.querySelectorAll('.segmented-control__option');

      function updateIndicator(index) {
        const option = options[index];
        const controlRect = control.getBoundingClientRect();
        const optionRect = option.getBoundingClientRect();
        
        const padding = 4;
        const relativeLeft = optionRect.left - controlRect.left - padding;
        
        indicator.style.transform = `translateX(${relativeLeft}px)`;
        indicator.style.width = `${optionRect.width}px`;
      }

      options.forEach((option, index) => {
        option.addEventListener('click', () => {
          options.forEach(opt => opt.classList.remove('active'));
          option.classList.add('active');
          updateIndicator(index);
        });
      });

      updateIndicator(0);
    });
  </script>
</body>
</html>