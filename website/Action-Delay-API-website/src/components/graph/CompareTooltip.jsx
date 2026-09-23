import {useEffect,useLayoutEffect,useId,useRef,useState} from 'react';
import {createPortal} from 'preact/compat';

// Render outside table/scroll containers, then clamp to the viewport.
export default function CompareTooltip({label,children}) {
  const anchor=useRef(null), bubble=useRef(null);
  const id=useId();
  const [open,setOpen]=useState(false),[position,setPosition]=useState({left:8,top:8});
  useLayoutEffect(()=>{
    if(!open||!anchor.current||!bubble.current)return;
    const a=anchor.current.getBoundingClientRect(),b=bubble.current.getBoundingClientRect();
    setPosition({left:Math.max(8,Math.min(a.left,window.innerWidth-b.width-8)),top:Math.max(8,Math.min(a.top-b.height-8>=8?a.top-b.height-8:a.bottom+8,window.innerHeight-b.height-8))});
  },[open,label]);
  useEffect(()=>{
    const close=()=>setOpen(false);
    window.addEventListener('resize',close);window.addEventListener('scroll',close,true);
    return ()=>{window.removeEventListener('resize',close);window.removeEventListener('scroll',close,true);};
  },[]);
  return <span ref={anchor} tabIndex={0} className="compare-tooltip-trigger" aria-describedby={open?id:undefined}
    onMouseEnter={()=>setOpen(true)} onMouseLeave={()=>{if(document.activeElement!==anchor.current)setOpen(false);}}
    onFocus={()=>setOpen(true)} onBlur={()=>setOpen(false)} onKeyDown={e=>{if(e.key==='Escape')setOpen(false);}}>
    {children}{open&&createPortal(<span id={id} ref={bubble} role="tooltip" className="compare-tooltip" style={position}>{label}</span>,document.body)}
  </span>;
}
