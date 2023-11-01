const express = require('express')
const path = require('path')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/prediksiCuaca')
const axios = require('axios');


const app = express()

// Mendefinisikan jalur/path untuk konfigurasi express
const direktoriPublic = path.join(__dirname, '../public')
const direktoriViews = path.join(__dirname, '../templates/views')
const direktoriPartials = path.join(__dirname, '../templates/partials')

//Setup handlebars engine dan lokasi folder views
app.set('view engine', 'hbs')
app.set('views',direktoriViews)
hbs.registerPartials(direktoriPartials)

//Setup direktori statis
app.use(express.static(direktoriPublic))

//ini halaman utama
app.get('', (req, res) => {
res.render('index', {
    judul: 'Aplikasi Cek Cuaca',
    nama: 'Muhammad Gilang Bagindo'
})
})

//ini halaman bantuan
app.get('/bantuan', (req, res) => {
    res.render('bantuan', {
    judul: 'Halaman Bantuan',
    nama: 'Muhammad Gilang Bagindo',
    teksBantuan: 'Ini adalah teks bantuan'
    })
})

//ini halaman info Cuaca
app.get('/infocuaca', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: ' Kamu harus memasukan lokasi yang ingin dicari'
        })
    }
    geocode(req.query.address, (error, { latitude, longitude, 
location } = {}) => {
        if (error){
            return res.send({error})
        }
        forecast(latitude, longitude, (error, dataPrediksi) => {
            if (error){
                return res.send({error})
        }
            res.send({
                prediksiCuaca: dataPrediksi,
                lokasi: location,
                address: req.query.address
            })
        })
    })
})

//ini halaman tentang
app.get('/tentang', (req, res) => {
    res.render('tentang', {
        judul: 'Tentang Saya',
        nama: 'Muhammad Gilang Bagindo',
        nim : '21343030',
        ttl : 'Payakumbuh, 26 Mei 2003',
        alamat: 'Payakumbuh, Sumatera Barat',
        telepon: '089610138331',
        wa: '081365902838',
        email: 'mgilangbagindo@gmail.com',
        pendidikan: [
            {
                institusi: 'Universitas Negeri Padang',
                prodi: 'S1 Informatika',
            }
        ],
        hobi: ['Mobile Legends', 'Futsal', 'Badminton', 'PES'], 
    })
})

// ini halaman berita
app.get('/berita', async (req, res) => {
    try {
        const urlApiMediaStack = 'http://api.mediastack.com/v1/news';
        const apiKey = '0efcf98ffec0ec4fc3ce3255dba4f532';

        const params = {
            access_key: apiKey,
            category: 'sports', 
        };

        const response = await axios.get(urlApiMediaStack, { params });
        const dataBerita = response.data;

        res.render('berita', {
            nama: 'Muhammad Gilang Bagindo',
            judul: 'Laman Berita',
            berita: dataBerita.data,
        });
    } catch (error) {
        console.error(error);
        res.render('error', {
            judul: 'Terjadi Kesalahan',
            pesanKesalahan: 'Terjadi kesalahan saat mengambil berita.',
        });
    }
});



app.get('/bantuan/*',(req,res)=>{
    res.render('404',{
        judul: '404',
        nama: 'Muhammad Gilang Bagindo',
        pesanKesalahan:'Artikel yang dicari tidak ditemukan'
    })
})

app.get('*',(req,res)=>{
    res.render('404',{
        judul:'404',
        nama: 'Muhammad Gilang Bagindo',
        pesanKesalahan:'Halaman tidak ditemukan'
    })
})

app.listen(4000, () => {
console.log('Server berjalan pada port 4000.')
})