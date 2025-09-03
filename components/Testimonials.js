// components/Testimonials.js
import Image from 'next/image';

export default function Testimonials() {
  const testimonials = [
    { name:'John D.', text:'Oakline Bank made opening my account seamless!', img:'/images/testimonial-1.jpg.JPG' },
    { name:'Samantha K.', text:'I love the mobile app and instant notifications.', img:'/images/testimonial-2.jpg.JPG' },
    { name:'Michael P.', text:'Great customer support and easy enrollment.', img:'/images/testimonial-3.jpg.JPG' },
  ];

  return (
    <section style={{ padding:'50px', background:'#e5f1fb' }}>
      <h2 style={{ textAlign:'center', marginBottom:'30px' }}>What Our Customers Say</h2>
      <div style={{ display:'flex', justifyContent:'center', flexWrap:'wrap', gap:'20px' }}>
        {testimonials.map((t,i)=>(
          <div key={i} style={{ background:'#fff', padding:'20px', borderRadius:'10px', width:'250px', textAlign:'center' }}>
            <Image src={t.img} width={80} height={80} alt={t.name} style={{ borderRadius:'50%' }} />
            <p style={{ marginTop:'15px', fontStyle:'italic' }}>"{t.text}"</p>
            <strong>{t.name}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}
