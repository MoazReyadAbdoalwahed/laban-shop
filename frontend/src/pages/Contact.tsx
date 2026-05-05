// src/pages/Contact.tsx
import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaPhone, FaMapMarkerAlt, FaFacebook, FaWhatsapp, FaInstagram } from 'react-icons/fa'
import { useTranslation } from 'react-i18next'
import { MdEmail } from 'react-icons/md'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const } }
}

function Contact() {
  const { t } = useTranslation()
  const [form, setForm] = useState({ name: '', phone: '', subject: 'General Inquiry', message: '' })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleSubmit(e: React.MouseEvent) {
    e.preventDefault()
    // TODO: connect to your API here
  }

  const contactItems = [
    { label: 'Call Us', value: '01065689196', icon: <FaPhone size={16} color="#1a56db" />, bg: 'bg-blue-50' },
    { label: 'Location', value: 'Al-Rawda, Egypt', icon: <FaMapMarkerAlt size={16} color="#16a34a" />, bg: 'bg-green-50' },
    { label: 'Email', value: 'jdnejssikemd@gmail.com', icon: <MdEmail size={18} color="#0f1e35" />, bg: 'bg-indigo-50' },
  ]

  const socials = [
    { icon: <FaFacebook size={16} />, href: 'https://www.facebook.com/share/1DtkVppLtB/?mibextid=wwXIfr' },
    { icon: <FaWhatsapp size={16} />, href: 'https://wa.me/201095592832' },
    { icon: <FaInstagram size={16} />, href: '#' },
  ]

  return (
    <div className='bg-white text-gray-900'>

      {/* HEADER */}
      <div className='bg-[#f0f4ff] text-center py-14 px-4'>
        <motion.div variants={fadeUp} initial='hidden' animate='visible'>
          <h1 className='text-4xl sm:text-5xl font-bold mb-3' style={{ fontFamily: 'Playfair Display,serif' }}>
            {t('contactHeader')}
          </h1>
          <p className='text-gray-500 text-sm leading-relaxed max-w-md mx-auto'>
            We're here to serve you. Share your inquiries or visit our farm in Al-Rawda to experience fresh Al-Labban dairy products directly from the source.
          </p>
        </motion.div>
      </div>

      {/* MAIN GRID */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6 px-6 sm:px-12 py-10 max-w-5xl mx-auto'>

        {/* FORM */}
        <motion.div className='bg-white border border-gray-200 rounded-2xl p-8 shadow-sm'
          variants={fadeUp} initial='hidden' whileInView='visible' viewport={{ once: true }}>
          <h3 className='text-2xl font-bold mb-1' style={{ fontFamily: 'Playfair Display,serif' }}>Send Us a Message</h3>
          <p className='text-gray-400 text-sm mb-6'>We'd love to hear your feedback and suggestions.</p>

          <div className='grid grid-cols-2 gap-4 mb-4'>
            {[
              { name: 'name', label: 'FULL NAME', type: 'text', placeholder: "Enter your name" },
              { name: 'phone', label: 'PHONE NUMBER', type: 'tel', placeholder: '010XXXXXXXX' },
            ].map(f => (
              <div key={f.name} className='flex flex-col gap-1'>
                <label className='text-xs font-semibold text-gray-500 tracking-wider'>{f.label}</label>
                <input name={f.name} type={f.type} placeholder={f.placeholder} value={form[f.name as keyof typeof form]} onChange={handleChange}
                  className='border-b border-gray-200 focus:border-orange-400 py-2 text-sm outline-none bg-transparent transition-colors' />
              </div>
            ))}
          </div>

          <div className='flex flex-col gap-1 mb-4'>
            <label className='text-xs font-semibold text-gray-500 tracking-wider'>SUBJECT</label>
            <select name='subject' value={form.subject} onChange={handleChange}
              className='border-b border-gray-200 focus:border-orange-400 py-2 text-sm outline-none bg-transparent transition-colors'>
              <option>General Inquiry</option>
              <option>Order Issue</option>
              <option>Wholesale</option>
              <option>Farm Visit</option>
            </select>
          </div>

          <div className='flex flex-col gap-1 mb-6'>
            <label className='text-xs font-semibold text-gray-500 tracking-wider'>MESSAGE</label>
            <textarea name='message' placeholder='How can we help you?' rows={4} value={form.message} onChange={handleChange}
              className='border-b border-gray-200 focus:border-orange-400 py-2 text-sm outline-none bg-transparent transition-colors resize-none' />
          </div>

          <button onClick={handleSubmit}
            className='bg-black hover:bg-gray-900 text-white font-bold px-8 py-3.5 rounded-xl text-sm transition-all hover:-translate-y-1 flex items-center gap-2'>

            ➤ Send Message
          </button>
        </motion.div>

        {/* RIGHT COL */}
        <div className='flex flex-col gap-4'>

          {/* CONTACT INFO */}
          <motion.div className='bg-white border border-gray-200 rounded-2xl p-6 shadow-sm'
            variants={fadeUp} initial='hidden' whileInView='visible' viewport={{ once: true }} transition={{ delay: .1 }}>
            <h3 className='font-bold text-lg mb-5 pl-3 border-l-4 border-orange-500'
              style={{ fontFamily: 'Playfair Display,serif' }}>Contact Details</h3>

            {contactItems.map((c, i) => (
              <div key={i} className='flex items-center justify-between mb-4'>
                <div>
                  <p className='text-xs text-gray-400 mb-0.5'>{c.label}</p>
                  <p className='text-sm font-semibold'>{c.value}</p>
                </div>
                <div className={`w-10 h-10 rounded-xl ${c.bg} flex items-center justify-center`}>
                  {c.icon}
                </div>
              </div>
            ))}

            <div className='mt-4 pt-4 border-t border-gray-100'>
              <p className='text-xs text-gray-400 mb-3'>Also find us on</p>
              <div className='flex gap-3'>
                {socials.map((s, i) => (
                  <a key={i} href={s.href} target='_blank' rel='noopener'
                    className='w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:border-orange-400 hover:text-orange-500 hover:bg-orange-50 transition-all'>
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* IMAGE CARD */}
          <motion.div className='rounded-2xl overflow-hidden h-40 relative bg-gradient-to-br from-amber-300 to-orange-400 flex items-center justify-center text-5xl'
            variants={fadeUp} initial='hidden' whileInView='visible' viewport={{ once: true }} transition={{ delay: .2 }}>
            🥛
            <div className='absolute bottom-3 right-3 bg-black/50 text-white text-xs font-semibold px-3 py-1 rounded-lg'>
              100% Natural · From Our Farm
            </div>
          </motion.div>
        </div>
      </div>

      {/* MAP */}
      <div className='px-6 sm:px-12 max-w-5xl mx-auto mb-6'>
        <motion.div
          className='rounded-2xl overflow-hidden h-64 shadow-lg'
          variants={fadeUp}
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true }}
        >
          <iframe
            title="Al-Labban Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13627.56821217646!2d31.7645!3d31.2586!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14f9e31505d9e5d1%3A0xc1b9649931b26466!2sAr%20Rawdah%2C%20Markaz%20Faraskur%2C%20Damietta%20Governorate!5e0!3m2!1sen!2seg!4v1714123456789!5m2!1sen!2seg"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </motion.div>
      </div>

      {/* FRESHNESS BAR */}
      <div className='bg-[#f0f4ff] px-6 sm:px-12 py-5'>
        <div className='max-w-5xl mx-auto flex items-center gap-4 flex-wrap'>
          <span className='text-xs font-bold text-black'>Farm</span>

          <div className='flex-1 bg-blue-200 rounded-full h-2 min-w-[60px]'>
            <div className='h-full w-4/5 bg-gradient-to-r from-orange-400 to-[#0f1e35] rounded-full' />
          </div>
          <span className='text-xs font-bold text-black'>We Are Here</span>

          <div className='flex-1 bg-blue-200 rounded-full h-2 min-w-[60px]'>
            <div className='h-full w-full bg-gradient-to-r from-orange-400 to-[#0f1e35] rounded-full' />
          </div>
          <span className='text-xs font-bold text-black'>Table</span>

          <span className='text-xs font-bold text-black ml-auto'>🥛 Fresh in under 24 hours</span>

        </div>
      </div>

    </div>
  )
}

export default Contact