from django.test import TestCase

# Create your tests here.
from .models import Contact
from django.core.exceptions import ValidationError
from django.urls import reverse

class ContactModelTests(TestCase):
    def setUp(self):
        """
        Seed contacts to test
        """
        Contact.objects.create(name='contact1', email='test@test.com', phone='1263636', address="address 1")
        Contact.objects.create(name='contact2', email='test@test.com')

    def test_create_valiation(self):
        """
        Test to create empty name & invalid email
        """
        with self.assertRaises(ValidationError) as test:
            contact = Contact.objects.create(email='3232131')
            contact.full_clean()
        the_exception = dict(test.exception)
        self.assertEqual(the_exception['name'], ['This field cannot be blank.'])
        self.assertEqual(the_exception['email'], ['Enter a valid email address.'])
            

    def test_allContacts(self):
        """
        Load all seeded contacts and compare
        """
        qs = Contact.objects.all()
        self.assertQuerysetEqual(
            qs,
            [
                '<Contact: contact1>',
                '<Contact: contact2>'
            ],
            ordered=False
        )

    def test_findContact(self):
        """
        Load all seeded contacts and pick the first one and get and compare
        """
        qs = Contact.objects.all()
        contact = qs[0]
        contact2 = Contact.objects.get(id=contact.id)
        self.assertEqual(contact, contact2)

    def test_filterContacts(self):
        """
        filter contact lists
        """
        qs = Contact.objects.filter(name='contact2')
        self.assertQuerysetEqual(
            qs,
            [
                '<Contact: contact2>'
            ],
            ordered=False
        )

    def test_updateContact(self):
        """
        Load all seeded contacts and pick the first one and update and compare
        """
        qs = Contact.objects.all()
        contact = qs[0]
        contact2 = Contact.objects.get(id=contact.id)
        to_update_value = 'address 2'
        contact2.address = to_update_value
        contact2.save()
        # refresh from db
        contact3 = Contact.objects.get(id=contact.id)
        self.assertEqual(contact3.address, to_update_value)

    def test_deleteContact(self):
        """
        delete contact2
        """
        Contact.objects.filter(name='contact2').delete()
        qs = Contact.objects.all()
        self.assertQuerysetEqual(
            qs,
            [
                '<Contact: contact1>'
            ],
            ordered=False
        )



class ContactRestTests(TestCase):
    def setUp(self):
        """
        Rest url
        """
        self.url = reverse('addressBook:contact-list')

        """
        Seed contacts to test
        """
        self.client.post(self.url, {'name':'contact1', 'email':'test@test.com', 'phone':'1263636', 'address':'address 1'})
        self.client.post(self.url, {'name':'contact2', 'email':'test@test.com'})

    def test_allContacts(self):
        # get 'api/contacts'
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)
        contacts = response.json()
        self.assertEqual(contacts[0]['name'], 'contact1')
        self.assertEqual(contacts[1]['name'], 'contact2')

    def test_findContact(self):
        """
        Load all seeded contacts and pick the first one and get and compare
        """
        response = self.client.get(self.url)
        qs = response.json()
        contact = qs[0]
        response = self.client.get(self.url + str(contact['id']) + '/')
        self.assertEqual(response.status_code, 200)
        contact2 = response.json()
        self.assertEqual(contact2['name'], 'contact1')

    def test_updateContact(self):
        """
        Load all seeded contacts and pick the first one and update and compare
        """
        response = self.client.get(self.url)
        qs = response.json()
        contact = qs[0]
        to_update_value = 'address 2'
        contact['address'] = to_update_value
        response = self.client.put(self.url + str(contact['id']) + '/', contact, content_type="application/json")
        self.assertEqual(response.status_code, 200)
        contact2 = response.json()
        self.assertEqual(contact2['address'], to_update_value)

    def test_deleteContact(self):
        """
        delete contact2
        """
        response = self.client.get(self.url)
        qs = response.json()
        contact = qs[1]
        response = self.client.delete(self.url + str(contact['id']) + '/')
        self.assertEqual(response.status_code, 204)
        response = self.client.get(self.url)
        self.assertEqual(len(response.json()), 1)