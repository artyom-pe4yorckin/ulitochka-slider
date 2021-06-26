# ulitochka-slider
slider for websites
<p>Just add "ulitochka" class and slider will be done.</p>
<p>You also can customize some parameters with attributes:</p>
<table>
	<thead>
		<tr>
      <td><b>what is he doing</b></td>
			<td><b>attridute</b></td>
			<td><b>example</b></td>
		</tr>
	</thead>
	<tbody>
	<tr>
		<td>the number of slides shown at a time</td>
		<td>
            <b>ulitochka-show-slides</b>="number"
            <p>by default 1</p>
        </td>
		<td>ulitochka-show-slides="3"</td>
	</tr>
	<tr>
		<td>gap between slides</td>
		<td>
            <b>ulitochka-gap-slides</b>="css value"
            <p>by default 0</p>
        </td>
		<td>ulitochka-gap-slides="2rem"</td>
	</tr>
	<tr>
		<td>slides height</td>
		<td>
            <b>ulitochka-height-slides</b>="css value"
            <p>by default auto</p>
        </td>
		<td>ulitochka-height-slides="300px"</td>
	</tr>
	<tr>
		<td>wrap arrows into div</td>
		<td><b>ulitochka-arrow-wrapper</b></td>
		<td></td>
	</tr>
	<tr>
		<td>adaptability (how many slides to show and what is their height on different screens)</td>
		<td><b>ulitochka-adaptive</b>="[screen width, slides to show, slides height]"</td>
		<td>ulitochka-adaptive="[800,1, 300px], [1000,2, 400px]"</td>
	</tr>
	<tr>
		<td>how slides appear (shift or fading)</td>
		<td>
            <p><b>ulitochka-animation</b>="shift|appear"<p>
            <p>by default ulitochka-animation="shift"<p>
        </td>
		<td>ulitochka-animation="appear"</td>
	</tr>
	<tr>
		<td>open overlay slider</td>
		<td><b>ulitochka-hirez</b>="[left arrow classes] <br>[right arrow classes] <br>[close button classes]" <p>to skip element set "[]"</p></td>
		<td>ulitochka-hirez="[left-btn yyee], [], [close-btn]"</td>
	</tr>
	<tr>
		<td>add classes to arrows</td>
		<td><b>ulitochka-arrow-class</b>="[left arrow classes] [right arrow classes]"</td>
		<td>ulitochka-arrow-class="[dashicons, dashicons-arrow-left-alt] [dashicons, dashicons-arrow-right-alt]"</td>
	</tr>
	<tr>
		<td>navigation dots</td>
		<td><b>ulitochka-dots</b>, if you want dots to show progress set "accumulate" value to this attribute</td>
		<td>ulitochka-dots="accumulate"</td>
	</tr>
	</tbody>
</table>
<p>But ulitochka has 1 parameter that is not controlled by the attribute, is autoslide. To use autoslide you need type something in js file or script tag:</p>
<p>setInterval(ulitochkaSlide.bind(selector), delay, "direction", true);</p>
<p><b>selector</b> must choose block with class="ulitochka"</p>
<p><b>delay</b> set in milliseconds</p>
<p><b>direction</b> should be equal "left" or "right"</p>
<p>If you want add some style to active slide use class "active-slide"</p>
